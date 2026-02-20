from langgraph.graph import StateGraph, END
from services.agent_state import AgentState
 
from services.nodes.command_understanding import command_understanding_node
from services.nodes.task_node import task_node
from services.nodes.qa_node import qa_node
from services.nodes.analyze_node import analyze_node
from services.nodes.merge_node import merge_node

def route_dispatch(state: AgentState):
    routes = []
    
    print(f"DEBUG Router received state keys: {state.keys()}")
    print(f"DEBUG Router 'analyze' value: {state.get('analyze')}")
    
    if state.get("analyze") is True:
        routes.append("analyze")
        
    if state.get("tasks"):
        routes.append("task")
        
    if state.get("qa_enabled") is True or state.get("time_range") is not None:
        routes.append("qa")
         
    if not routes:
        print("DEBUG Router: No routes found, moving to merge")
        return ["merge"]
    
    print(f"DEBUG Router: Directing to nodes: {routes}")
    return routes


def build_agent():
    workflow = StateGraph(AgentState)

    # Add Nodes
    workflow.add_node("understand", command_understanding_node)
    workflow.add_node("task", task_node)
    workflow.add_node("qa", qa_node)
    workflow.add_node("analyze", analyze_node)
    workflow.add_node("merge", merge_node)

    #  Set Entry Point
    workflow.set_entry_point("understand")

    #  Add Conditional Edges 
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

    
    workflow.add_edge("task", "merge")
    workflow.add_edge("qa", "merge")
    workflow.add_edge("analyze", "merge")

    workflow.add_edge("merge", END)

    return workflow.compile()