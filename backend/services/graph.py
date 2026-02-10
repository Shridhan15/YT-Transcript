from langgraph.graph import StateGraph, END
from services.agent_state import AgentState

# Import your nodes
from services.nodes.command_understanding import command_understanding_node
from services.nodes.task_node import task_node
from services.nodes.qa_node import qa_node
from services.nodes.analyze_node import analyze_node
from services.nodes.merge_node import merge_node

def route_dispatch(state: AgentState):
    """
    Determines which nodes to run in parallel.
    """
    routes = []
    
    if state.get("tasks"):
        routes.append("task")
        
    if state.get("qa_enabled"):
        routes.append("qa")
        
    if state.get("analyze"):
        routes.append("analyze")
        
    # Fallback: if no logic nodes are triggered, go to merge
    if not routes:
        return ["merge"]
        
    return routes

def build_agent():
    workflow = StateGraph(AgentState)

    # 1. Add Nodes
    workflow.add_node("understand", command_understanding_node)
    workflow.add_node("task", task_node)
    workflow.add_node("qa", qa_node)
    workflow.add_node("analyze", analyze_node)
    workflow.add_node("merge", merge_node)

    # 2. Set Entry Point
    workflow.set_entry_point("understand")

    # 3. Add Conditional Edges (Fan-Out)
    workflow.add_conditional_edges(
        "understand",
        route_dispatch,
        {
            "task": "task",
            "qa": "qa",
            "analyze": "analyze",
            "merge": "merge"
        }
    )

    # 4. Add Fan-In Edges (All parallel nodes go to merge)
    workflow.add_edge("task", "merge")
    workflow.add_edge("qa", "merge")
    workflow.add_edge("analyze", "merge")

    # 5. Finish
    workflow.add_edge("merge", END)

    return workflow.compile()