from enum import IntEnum, Enum


class CustomEvents(Enum):
    QUERY = "query"
    STATUS_UPDATE = "status-update"
    QUERIES_GENERATED = "queries-generated"
    URLS_GENERATED = "urls-generated"
    REPORT_GENERATED = "report-generated"
    ERROR = "error"


class Statuses(IntEnum):
    WAITING_CONNECTION = (0,)
    READY = 1
    GENERATING_QUERIES = 2
    SEARCHING_WEB = 3
    SCRAPING_DATA = 4
    GENERATING_REPORT = 5
    COMPLETE = 6
