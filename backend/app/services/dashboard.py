from sqlalchemy import func
from sqlalchemy.orm import Session
from models import Vendor, RFQ, Quotation, RFQStatus, QuotationStatus

class DashboardService:
    @staticmethod
    def get_summary(db_session: Session) -> dict:
        """
        Gathers count metrics, total procurement spend, and status breakdowns from MySQL.
        """
        total_vendors = db_session.query(func.count(Vendor.id)).scalar() or 0
        total_rfqs = db_session.query(func.count(RFQ.id)).scalar() or 0
        total_quotations = db_session.query(func.count(Quotation.id)).scalar() or 0
        
        # Spend is defined as the sum of all approved quotations
        total_spend = db_session.query(func.sum(Quotation.price)).filter(
            Quotation.status == QuotationStatus.APPROVED
        ).scalar() or 0.0
        
        # Aggregate RFQ status distribution counts
        rfq_status_breakdown = {status_enum.value: 0 for status_enum in RFQStatus}
        rfq_counts = db_session.query(RFQ.status, func.count(RFQ.id)).group_by(RFQ.status).all()
        for status_enum, count in rfq_counts:
            if status_enum:
                rfq_status_breakdown[status_enum.value] = count
                
        # Aggregate Quotation status distribution counts
        quotation_status_breakdown = {status_enum.value: 0 for status_enum in QuotationStatus}
        quot_counts = db_session.query(Quotation.status, func.count(Quotation.id)).group_by(Quotation.status).all()
        for status_enum, count in quot_counts:
            if status_enum:
                quotation_status_breakdown[status_enum.value] = count
                
        return {
            "total_vendors": total_vendors,
            "total_rfqs": total_rfqs,
            "total_quotations": total_quotations,
            "total_spend": float(total_spend),
            "rfq_status_breakdown": rfq_status_breakdown,
            "quotation_status_breakdown": quotation_status_breakdown
        }
