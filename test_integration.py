"""Simple integration test to verify end-to-end flow."""

from pathlib import Path
from data_generator.generator import generate_data
from scheduler.data_loader import DataLoader
from scheduler.job_shop_solver import JobShopSolver
from scheduler.baseline_scheduler import BaselineScheduler
from scheduler.kpi import compare_schedules, format_kpi_report

def test_integration():
    """Test the full pipeline."""
    print("Testing CNC Job Shop MVP Integration...")
    
    # Step 1: Generate data
    print("\n1. Generating synthetic data...")
    data_dir = Path("data/synthetic")
    generate_data(str(data_dir), seed=42)
    print("   ✓ Data generated")
    
    # Step 2: Load data
    print("\n2. Loading data...")
    loader = DataLoader(data_dir)
    loader.load_all()
    print(f"   ✓ Loaded {len(loader.order_ops)} operations")
    print(f"   ✓ Loaded {len(loader.orders)} orders")
    print(f"   ✓ Horizon end: {loader.get_horizon_end_min()} minutes")
    
    # Step 3: Baseline scheduler
    print("\n3. Running baseline scheduler (EDD)...")
    baseline = BaselineScheduler(loader)
    baseline_schedule = baseline.schedule_edd()
    baseline_makespan = baseline.get_makespan()
    print(f"   ✓ Baseline makespan: {baseline_makespan} minutes")
    
    # Step 4: Optimized scheduler
    print("\n4. Running optimized scheduler (CP-SAT)...")
    solver = JobShopSolver(loader)
    solver.build_model()
    solved = solver.solve()
    
    if solved:
        optimized_makespan = solver.get_makespan()
        status = solver.get_status_string()
        print(f"   ✓ Optimized makespan: {optimized_makespan} minutes")
        print(f"   ✓ Solver status: {status}")
        print(f"   ✓ Improvement: {baseline_makespan - optimized_makespan} minutes ({((baseline_makespan - optimized_makespan) / baseline_makespan * 100):.1f}%)")
    else:
        print("   ✗ Solver failed")
        return False
    
    # Step 5: Check M03 operations
    print("\n5. Checking M03 operations...")
    m03_ops_baseline = [op for op in baseline_schedule if op["machine_id"] == "M03"]
    m03_ops_optimized = [op for op in solver.schedule if op["machine_id"] == "M03"]
    print(f"   ✓ M03 operations in baseline: {len(m03_ops_baseline)}")
    print(f"   ✓ M03 operations in optimized: {len(m03_ops_optimized)}")
    
    # Step 6: KPI comparison
    print("\n6. Computing KPIs...")
    comparison = compare_schedules(baseline_schedule, solver.schedule, loader, "M03")
    print("\n" + format_kpi_report(comparison))
    
    print("\n✓ Integration test passed!")
    return True

if __name__ == "__main__":
    test_integration()



