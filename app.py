"""Flask web application for CNC job shop scheduling."""

import json
from pathlib import Path
from datetime import datetime, timedelta
from flask import Flask, render_template, jsonify, request
from data_generator.generator import generate_data
from data_generator.config import BASE_DATE
from scheduler.data_loader import DataLoader
from scheduler.job_shop_solver import JobShopSolver
from scheduler.baseline_scheduler import BaselineScheduler
from scheduler.kpi import compute_kpis, compare_schedules

app = Flask(__name__)
app.config["SECRET_KEY"] = "dev-secret-key"

DATA_DIR = Path("data/synthetic")

# Cache for schedule data (in production, use Redis or database)
_schedule_cache = {}


@app.route("/")
def index():
    """Homepage - Dashboard."""
    return render_template("index.html")


@app.route("/schedule")
def schedule_view():
    """Schedule visualization page."""
    return render_template("schedule.html")


@app.route("/api/generate", methods=["POST"])
def api_generate():
    """Generate synthetic data."""
    try:
        seed = int(request.json.get("seed", 42)) if request.json else 42
        generate_data(str(DATA_DIR), seed=seed)
        
        # Clear cache when new data is generated
        _schedule_cache.clear()
        
        # Load data to get summary info
        loader = DataLoader(DATA_DIR)
        loader.load_all()
        
        return jsonify({
            "status": "success",
            "message": "Data generated successfully",
            "summary": {
                "operations": len(loader.order_ops),
                "orders": len(loader.orders),
                "machines": len(loader.machines),
                "horizon_minutes": loader.get_horizon_end_min(),
            }
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/schedule", methods=["POST"])
def api_schedule():
    """Run scheduler (both baseline and optimized)."""
    try:
        # Load data
        loader = DataLoader(DATA_DIR)
        loader.load_all()

        # Baseline scheduler (EDD)
        baseline = BaselineScheduler(loader)
        baseline_schedule = baseline.schedule_edd()
        baseline_makespan = baseline.get_makespan()

        # Optimized scheduler (CP-SAT)
        solver = JobShopSolver(loader)
        solver.build_model()
        solved = solver.solve()
        optimized_schedule = solver.schedule if solved else []
        optimized_makespan = solver.get_makespan() if solved else 0
        status = solver.get_status_string() if solved else "FAILED"

        # Calculate KPIs using the same logic for both
        baseline_kpis = compute_kpis(baseline_schedule, loader, "M03")
        optimized_kpis = compute_kpis(optimized_schedule, loader, "M03") if solved else {}

        # Get machine info
        machines = loader.machines.to_dict('records')
        
        # Get orders info for completion tracking
        orders = []
        for _, order in loader.orders.iterrows():
            orders.append({
                "order_id": order["order_id"],
                "sku_id": order["sku_id"],
                "release_time_min": int(order["release_time_min"]),
                "due_time_min": int(order["due_time_min"]),
            })

        # Cache the schedules
        _schedule_cache["baseline"] = baseline_schedule
        _schedule_cache["optimized"] = optimized_schedule
        _schedule_cache["loader"] = loader

        # Get t0 for time conversion
        t0_str = loader.t0.strftime("%Y-%m-%d %H:%M") if loader.t0 else BASE_DATE.strftime("%Y-%m-%d %H:%M")

        return jsonify({
            "status": "success",
            "t0": t0_str,
            "machines": machines,
            "orders": orders,
            "baseline": {
                "schedule": baseline_schedule,
                "makespan": baseline_makespan,
                "kpis": baseline_kpis,
            },
            "optimized": {
                "schedule": optimized_schedule,
                "makespan": optimized_makespan,
                "solver_status": status,
                "kpis": optimized_kpis,
            },
        })
    except Exception as e:
        import traceback
        return jsonify({"status": "error", "message": str(e), "traceback": traceback.format_exc()}), 500


@app.route("/api/kpis", methods=["GET"])
def api_kpis():
    """Calculate KPIs for baseline and optimized schedules."""
    try:
        # Load data
        loader = DataLoader(DATA_DIR)
        loader.load_all()

        # Get schedules (recalculate if not cached)
        baseline = BaselineScheduler(loader)
        baseline_schedule = baseline.schedule_edd()

        solver = JobShopSolver(loader)
        solver.build_model()
        solved = solver.solve()
        optimized_schedule = solver.schedule if solved else []

        # Use the KPI comparison function
        comparison = compare_schedules(baseline_schedule, optimized_schedule, loader, "M03")

        return jsonify({
            "status": "success",
            "baseline": comparison["baseline"],
            "optimized": comparison["optimized"],
            "improvement": comparison["improvement_pct"],
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/changeover", methods=["GET"])
def api_changeover():
    """Get changeover matrix for setup time visualization."""
    try:
        loader = DataLoader(DATA_DIR)
        loader.load_all()
        
        # Get changeover matrix as dict
        changeover = loader.changeover_matrix.to_dict('records')
        
        return jsonify({
            "status": "success",
            "changeover_matrix": changeover,
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/data/summary", methods=["GET"])
def api_data_summary():
    """Get summary of current data."""
    try:
        if not DATA_DIR.exists() or not (DATA_DIR / "orders.csv").exists():
            return jsonify({
                "status": "success",
                "has_data": False,
            })
        
        loader = DataLoader(DATA_DIR)
        loader.load_all()
        
        # Get M03 operations count
        m03_ops = len(loader.order_ops[loader.order_ops["machine_id"] == "M03"])
        
        return jsonify({
            "status": "success",
            "has_data": True,
            "summary": {
                "operations": len(loader.order_ops),
                "orders": len(loader.orders),
                "machines": len(loader.machines),
                "m03_operations": m03_ops,
                "horizon_minutes": loader.get_horizon_end_min(),
                "t0": loader.t0.strftime("%Y-%m-%d %H:%M") if loader.t0 else None,
            }
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
