import operator
from typing import TypedDict, List, Optional, Annotated

class TimeRange(TypedDict):
    start: float
    end: float

class AgentState(TypedDict):
    user_input: str
    url: Optional[str]
    current_video_time: float
    time_range: Optional[TimeRange] 
    tasks: List[dict]
    qa_enabled: bool
    qa_question: Optional[str]
    analyze: bool
    message_parts: Annotated[List[str], operator.add]
    message: str