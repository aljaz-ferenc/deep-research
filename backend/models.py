from enum import Enum

class CustomEvents(Enum):
    QUERY = 'query'
    STATUS_UPDATE = "status-update"
    QUERIES_GENERATED = "queries-generated"

class Statuses(Enum):
    GENERATING_QUERIES = "generating-queries"