from enum import IntEnum, Enum


class CustomEvents(Enum):
    QUERY = "query"
    STATUS_UPDATE = "status-update"
    QUERIES_GENERATED = "queries-generated"
    URLS_GENERATED = "urls-generated"
    REPORT_GENERATED = "report-generated"
    ERROR = "error"
    GUARDRAIL_DECISION="guardrail-decision"


class Statuses(IntEnum):
    WAITING_CONNECTION = (0,)
    READY = 1
    VERIFYING_INPUT = 2
    GENERATING_QUERIES = 3
    SEARCHING_WEB = 4
    SCRAPING_DATA = 5
    GENERATING_REPORT = 6
    COMPLETE = 7
