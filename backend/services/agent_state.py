import operator
from typing import TypedDict, List, Optional, Annotated

class AgentState(TypedDict):
    # Inputs
    user_input: str
    url: Optional[str]

    # Internal Logic Flags
    tasks: List[dict]           
    qa_enabled: bool
    qa_question: Optional[str]
    analyze: bool 
    message_parts: Annotated[List[str], operator.add]
    
    # Final combined output
    message: str