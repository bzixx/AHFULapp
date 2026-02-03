# Service for generating and storing reports to MongoDB
from enum import Enum
from datetime import datetime

from flaskr.AWS_core.AWSClientManager import AWSClientManager

class ReportType(Enum):
    CRED_COMPLIANCE = "cred_compliance"
    # Add more report types as needed

def generate_cred_compliance_report():
    # Collect uncompliant users
    awsClient = AWSClientManager()
    uncompliant_users = awsClient.get_users_with_direct_policies()

    # Create report structure
    report = {
        "report_type": ReportType.CRED_COMPLIANCE.value,
        "report_date_time": datetime.now().isoformat(),
        "uncompliant_users": uncompliant_users
    }

    return report

def check_report_type(report, report_type: ReportType):
    """
    Check if the report is of the given ReportType.
    """
    return report.get("report_type") == report_type.value
