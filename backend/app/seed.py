"""Seed the database with demo data matching the frontend mocks.

Usage: python -m backend.app.seed
"""

import asyncio
import logging
import uuid
from datetime import date, datetime, timezone

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.database import async_session_maker, engine, Base
from backend.app.core.security import hash_password
from backend.app.models import (
    Org,
    User,
    Membership,
    Machine,
    Customer,
    Product,
    Order,
    Run,
    RunStatus,
    RunTrigger,
    ScheduleOperation,
    RunMetric,
    Event,
    Alert,
)

logger = logging.getLogger(__name__)

# Stable UUIDs for demo data so they are predictable across seeds
ORG_ID = uuid.UUID("00000000-0000-4000-a000-000000000001")
USER_OWNER_ID = uuid.UUID("00000000-0000-4000-a000-000000000010")
USER_PLANNER_ID = uuid.UUID("00000000-0000-4000-a000-000000000020")
USER_SUPERVISOR_ID = uuid.UUID("00000000-0000-4000-a000-000000000030")

MACHINE_IDS = {
    "M1": uuid.UUID("00000000-0000-4000-b000-000000000001"),
    "M2": uuid.UUID("00000000-0000-4000-b000-000000000002"),
    "M3": uuid.UUID("00000000-0000-4000-b000-000000000003"),
    "M4": uuid.UUID("00000000-0000-4000-b000-000000000004"),
    "M5": uuid.UUID("00000000-0000-4000-b000-000000000005"),
}

CUSTOMER_IDS = {
    "acme": uuid.UUID("00000000-0000-4000-c000-000000000001"),
    "techcorp": uuid.UUID("00000000-0000-4000-c000-000000000002"),
    "global": uuid.UUID("00000000-0000-4000-c000-000000000003"),
    "precision": uuid.UUID("00000000-0000-4000-c000-000000000004"),
    "industrial": uuid.UUID("00000000-0000-4000-c000-000000000005"),
}

PRODUCT_IDS = {
    "shaft": uuid.UUID("00000000-0000-4000-d000-000000000001"),
    "housing": uuid.UUID("00000000-0000-4000-d000-000000000002"),
    "bracket": uuid.UUID("00000000-0000-4000-d000-000000000003"),
    "flange": uuid.UUID("00000000-0000-4000-d000-000000000004"),
    "valve": uuid.UUID("00000000-0000-4000-d000-000000000005"),
}

ORDER_IDS = {
    "O001": uuid.UUID("00000000-0000-4000-e000-000000000001"),
    "O002": uuid.UUID("00000000-0000-4000-e000-000000000002"),
    "O003": uuid.UUID("00000000-0000-4000-e000-000000000003"),
    "O004": uuid.UUID("00000000-0000-4000-e000-000000000004"),
    "O005": uuid.UUID("00000000-0000-4000-e000-000000000005"),
}

RUN_IDS = {
    "run1": uuid.UUID("00000000-0000-4000-f000-000000000001"),
    "run2": uuid.UUID("00000000-0000-4000-f000-000000000002"),
    "run3": uuid.UUID("00000000-0000-4000-f000-000000000003"),
}


async def seed_all(session: AsyncSession) -> None:
    """Insert all demo data inside a single transaction."""

    # Organization
    org = Org(id=ORG_ID, name="Demo Manufacturing Co.", slug="demo-mfg", is_active=True)
    session.add(org)

    # Users (password: "password123" for all demo users)
    pw_hash = hash_password("password123")

    users = [
        User(
            id=USER_OWNER_ID,
            email="amit@demo-mfg.com",
            password_hash=pw_hash,
            full_name="Amit Mishra",
            is_active=True,
        ),
        User(
            id=USER_PLANNER_ID,
            email="ravi@demo-mfg.com",
            password_hash=pw_hash,
            full_name="Ravi Rampaul",
            is_active=True,
        ),
        User(
            id=USER_SUPERVISOR_ID,
            email="priya@demo-mfg.com",
            password_hash=pw_hash,
            full_name="Priya Patel",
            is_active=True,
        ),
    ]
    session.add_all(users)

    # Memberships
    memberships = [
        Membership(org_id=ORG_ID, user_id=USER_OWNER_ID, role="owner"),
        Membership(org_id=ORG_ID, user_id=USER_PLANNER_ID, role="planner"),
        Membership(org_id=ORG_ID, user_id=USER_SUPERVISOR_ID, role="supervisor"),
    ]
    session.add_all(memberships)

    # Machines (match frontend mockMachines)
    machines = [
        Machine(id=MACHINE_IDS["M1"], org_id=ORG_ID, code="M1", name="CNC Mill #1", machine_type="Milling", status="operational", capacity_hours=8.0, setup_time_minutes=30.0, efficiency=0.87),
        Machine(id=MACHINE_IDS["M2"], org_id=ORG_ID, code="M2", name="CNC Mill #2", machine_type="Milling", status="operational", capacity_hours=8.0, setup_time_minutes=30.0, efficiency=0.85),
        Machine(id=MACHINE_IDS["M3"], org_id=ORG_ID, code="M3", name="Lathe #1", machine_type="Turning", status="operational", capacity_hours=8.0, setup_time_minutes=25.0, efficiency=0.82),
        Machine(id=MACHINE_IDS["M4"], org_id=ORG_ID, code="M4", name="Lathe #2", machine_type="Turning", status="maintenance", capacity_hours=8.0, setup_time_minutes=25.0, efficiency=0.80),
        Machine(id=MACHINE_IDS["M5"], org_id=ORG_ID, code="M5", name="Press #1", machine_type="Forming", status="operational", capacity_hours=8.0, setup_time_minutes=35.0, efficiency=0.83),
    ]
    session.add_all(machines)

    # Customers
    customers = [
        Customer(id=CUSTOMER_IDS["acme"], org_id=ORG_ID, code="ACME", name="Acme Industries", priority_tier="high"),
        Customer(id=CUSTOMER_IDS["techcorp"], org_id=ORG_ID, code="TECH", name="TechCorp Systems", priority_tier="high"),
        Customer(id=CUSTOMER_IDS["global"], org_id=ORG_ID, code="GLOB", name="Global Manufacturing", priority_tier="normal"),
        Customer(id=CUSTOMER_IDS["precision"], org_id=ORG_ID, code="PREC", name="Precision Parts Ltd", priority_tier="high"),
        Customer(id=CUSTOMER_IDS["industrial"], org_id=ORG_ID, code="IND", name="Industrial Solutions", priority_tier="normal"),
    ]
    session.add_all(customers)

    # Products
    products = [
        Product(id=PRODUCT_IDS["shaft"], org_id=ORG_ID, sku="A-320", name="Precision Shaft A-320", cycle_time_minutes=2.1, setup_time_minutes=45.0),
        Product(id=PRODUCT_IDS["housing"], org_id=ORG_ID, sku="B-150", name="Housing Unit B-150", cycle_time_minutes=2.1, setup_time_minutes=60.0),
        Product(id=PRODUCT_IDS["bracket"], org_id=ORG_ID, sku="C-890", name="Bracket Set C-890", cycle_time_minutes=0.9, setup_time_minutes=30.0),
        Product(id=PRODUCT_IDS["flange"], org_id=ORG_ID, sku="D-440", name="Custom Flange D-440", cycle_time_minutes=2.4, setup_time_minutes=50.0),
        Product(id=PRODUCT_IDS["valve"], org_id=ORG_ID, sku="E-220", name="Valve Body E-220", cycle_time_minutes=2.0, setup_time_minutes=40.0),
    ]
    session.add_all(products)

    # Orders (match frontend mockOrders)
    orders = [
        Order(id=ORDER_IDS["O001"], org_id=ORG_ID, customer_id=CUSTOMER_IDS["acme"], product_id=PRODUCT_IDS["shaft"], order_code="PO-2024-001", customer_name="Acme Industries", product_name="Precision Shaft A-320", quantity=150, priority="high", due_date=date(2026, 1, 5), status="in-progress", progress_pct=45.0),
        Order(id=ORDER_IDS["O002"], org_id=ORG_ID, customer_id=CUSTOMER_IDS["techcorp"], product_id=PRODUCT_IDS["housing"], order_code="PO-2024-002", customer_name="TechCorp Systems", product_name="Housing Unit B-150", quantity=200, priority="rush", due_date=date(2026, 1, 3), status="pending"),
        Order(id=ORDER_IDS["O003"], org_id=ORG_ID, customer_id=CUSTOMER_IDS["global"], product_id=PRODUCT_IDS["bracket"], order_code="PO-2024-003", customer_name="Global Manufacturing", product_name="Bracket Set C-890", quantity=300, priority="normal", due_date=date(2026, 1, 8), status="pending"),
        Order(id=ORDER_IDS["O004"], org_id=ORG_ID, customer_id=CUSTOMER_IDS["precision"], product_id=PRODUCT_IDS["flange"], order_code="PO-2024-004", customer_name="Precision Parts Ltd", product_name="Custom Flange D-440", quantity=100, priority="high", due_date=date(2026, 1, 6), status="pending"),
        Order(id=ORDER_IDS["O005"], org_id=ORG_ID, customer_id=CUSTOMER_IDS["industrial"], product_id=PRODUCT_IDS["valve"], order_code="PO-2024-005", customer_name="Industrial Solutions", product_name="Valve Body E-220", quantity=180, priority="normal", due_date=date(2026, 1, 10), status="pending"),
    ]
    session.add_all(orders)

    # Runs
    runs = [
        Run(
            id=RUN_IDS["run1"],
            org_id=ORG_ID,
            created_by_user_id=USER_PLANNER_ID,
            trigger=RunTrigger.MANUAL.value,
            run_name="Shift A - Jan 2",
            run_id="run-20260102-a",
            status=RunStatus.COMPLETED.value,
        ),
        Run(
            id=RUN_IDS["run2"],
            org_id=ORG_ID,
            created_by_user_id=USER_PLANNER_ID,
            trigger=RunTrigger.RESCHEDULE.value,
            parent_run_id=RUN_IDS["run1"],
            run_name="Shift A - Jan 2 (v2)",
            run_id="run-20260102-a-v2",
            status=RunStatus.COMPLETED.value,
        ),
        Run(
            id=RUN_IDS["run3"],
            org_id=ORG_ID,
            created_by_user_id=USER_PLANNER_ID,
            trigger=RunTrigger.MANUAL.value,
            run_name="Shift B - Jan 2",
            run_id="run-20260102-b",
            status="generating",
        ),
    ]
    session.add_all(runs)

    # Schedule operations for run1
    ts = lambda h, m: datetime(2026, 1, 2, h, m, tzinfo=timezone.utc)
    sched_ops = [
        ScheduleOperation(run_id=RUN_IDS["run1"], org_id=ORG_ID, order_code="PO-2024-001", machine_code="M1", product_name="Precision Shaft A-320", operation_seq=1, start_time=ts(8, 0), end_time=ts(14, 5), setup_minutes=45.0, processing_minutes=320.0, status="completed"),
        ScheduleOperation(run_id=RUN_IDS["run1"], org_id=ORG_ID, order_code="PO-2024-004", machine_code="M5", product_name="Custom Flange D-440", operation_seq=1, start_time=ts(8, 0), end_time=ts(12, 50), setup_minutes=50.0, processing_minutes=240.0, status="completed"),
        ScheduleOperation(run_id=RUN_IDS["run2"], org_id=ORG_ID, order_code="PO-2024-001", machine_code="M1", product_name="Precision Shaft A-320", operation_seq=1, start_time=ts(8, 0), end_time=ts(14, 5), setup_minutes=45.0, processing_minutes=320.0, status="scheduled"),
        ScheduleOperation(run_id=RUN_IDS["run2"], org_id=ORG_ID, order_code="PO-2024-002", machine_code="M2", product_name="Housing Unit B-150", operation_seq=1, start_time=ts(14, 30), end_time=ts(22, 30), setup_minutes=60.0, processing_minutes=420.0, status="scheduled"),
    ]
    session.add_all(sched_ops)

    # Run metrics
    metrics = [
        RunMetric(run_id=RUN_IDS["run1"], org_id=ORG_ID, on_time_delivery_pct=92.0, utilization_pct=65.0, total_setup_minutes=45.0, total_processing_minutes=320.0, makespan_hours=6.1, total_late_jobs=0, total_jobs=1, avg_flow_time_hours=6.1, downtime_minutes=0.0, reject_count=3),
        RunMetric(run_id=RUN_IDS["run2"], org_id=ORG_ID, on_time_delivery_pct=95.0, utilization_pct=82.0, total_setup_minutes=95.0, total_processing_minutes=740.0, makespan_hours=14.5, total_late_jobs=0, total_jobs=2, avg_flow_time_hours=7.2, downtime_minutes=8.0, reject_count=2),
    ]
    session.add_all(metrics)

    # Events
    events = [
        Event(org_id=ORG_ID, run_id=RUN_IDS["run1"], created_by_user_id=USER_SUPERVISOR_ID, event_type="machine_down", title="CNC Mill #1 spindle warning", description="Abnormal vibration detected on spindle during order PO-2024-001. Operator reduced speed by 10%."),
        Event(org_id=ORG_ID, run_id=RUN_IDS["run2"], created_by_user_id=USER_PLANNER_ID, event_type="order_added", title="Rush order PO-2024-002 inserted", description="TechCorp Systems requested rush delivery for Housing Unit B-150. Added to Shift A v2."),
    ]
    session.add_all(events)

    # Alerts
    alerts = [
        Alert(org_id=ORG_ID, alert_type="breakdown", severity="high", title="Lathe #2 under maintenance", message="Lathe #2 (M4) is currently offline for scheduled maintenance. Expected return: Jan 3 morning shift.", source_entity="machine", source_id="M4"),
        Alert(org_id=ORG_ID, alert_type="rush-order", severity="critical", title="Rush order PO-2024-002", message="TechCorp Systems rush order for 200x Housing Unit B-150 is due Jan 3. Requires immediate scheduling.", source_entity="order", source_id="PO-2024-002"),
        Alert(org_id=ORG_ID, alert_type="delay", severity="medium", title="Order PO-2024-003 at risk", message="Bracket Set C-890 order for Global Manufacturing may be delayed due to machine M4 maintenance.", source_entity="order", source_id="PO-2024-003"),
    ]
    session.add_all(alerts)

    # Set active run
    org.active_run_id = RUN_IDS["run2"]

    await session.commit()
    logger.info("Seed data inserted successfully.")


async def main() -> None:
    logging.basicConfig(level=logging.INFO)

    # Create all tables (for development; in production use alembic)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as session:
        # Check if data already exists
        result = await session.execute(text("SELECT count(*) FROM users"))
        count = result.scalar()
        if count and count > 0:
            logger.info("Database already seeded (%d users found). Skipping.", count)
            return

        await seed_all(session)


if __name__ == "__main__":
    asyncio.run(main())
