from enum import IntEnum, Enum

class CustomEvents(Enum):
    QUERY = 'query'
    STATUS_UPDATE = "status-update"
    QUERIES_GENERATED = "queries-generated"
    URLS_GENERATED = "urls-generated"

class Statuses(IntEnum):
    READY = 0
    GENERATING_QUERIES = 1
    SEARCHING_WEB = 2
    SCRAPING_DATA = 3