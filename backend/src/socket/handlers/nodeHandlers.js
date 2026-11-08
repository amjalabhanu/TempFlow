import { performNodeMutation } from "../utils/operationHelper.js";

export function registerNodeHandlers(io, socket) {

    // CREATE NODE
    socket.on("node:create", async (payload = {}, ack) => {
        const { node } = payload;

        if (
            !node ||
            typeof node !== "object" ||
            Array.isArray(node)
        ) {
            return ack?.({
                success: false,
                message: "Invalid payload"
            });
        }

        const { id, type, position, data } = node;

        if (
            typeof id !== "string" ||
            !id.trim() ||
            typeof type !== "string" ||
            !type.trim() ||
            !position ||
            !Number.isFinite(position.x) ||
            !Number.isFinite(position.y) ||
            !data ||
            typeof data !== "object" ||
            Array.isArray(data)
        ) {
            return ack?.({
                success: false,
                message: "Invalid node structure"
            });
        }

        await performNodeMutation(
            socket,
            {
                ...payload,
                nodeId: id
            },
            ack,
            "node:create",
            (nodes, edges) => {
                const alreadyExists = nodes.some(
                    existingNode => existingNode.id === id
                );

                if (alreadyExists) {
                    return { error: "Node already exists" };
                }

                return {
                    nodes: [...nodes, node],
                    edges,
                    payload: { node },
                    response: { node }
                };
            }
        );
    });


    // UPDATE NODE
    socket.on("node:update", async (payload = {}, ack) => {
        const { updates } = payload;

        if (
            !updates ||
            typeof updates !== "object" ||
            Array.isArray(updates) ||
            Object.keys(updates).length === 0 ||
            "id" in updates ||
            "position" in updates
        ) {
            return ack?.({ success: false, message: "Invalid node updates" });
        }

        if (
            updates.type !== undefined &&
            (typeof updates.type !== "string" || !updates.type.trim())
        ) {
            return ack?.({ success: false, message: "Invalid node type" });
        }

        if (
            updates.data !== undefined &&
            (!updates.data ||
                typeof updates.data !== "object" ||
                Array.isArray(updates.data))
        ) {
            return ack?.({ success: false, message: "Invalid node data" });
        }

        await performNodeMutation(
            socket,
            payload,
            ack,
            "node:update",
            (nodes, edges) => {
                const index = nodes.findIndex(node => node.id === payload.nodeId);

                if (index === -1) return { error: "Node not found" };

                const existingNode = nodes[index];

                const updatedNode = {
                    ...existingNode,
                    ...updates,
                    data: updates.data
                        ? { ...(existingNode.data || {}), ...updates.data }
                        : existingNode.data
                };

                const updatedNodes = [...nodes];
                updatedNodes[index] = updatedNode;

                return {
                    nodes: updatedNodes,
                    edges,
                    payload: {
                        nodeId: payload.nodeId,
                        updates
                    },
                    response: { node: updatedNode }
                };
            }
        );
    });


    // MOVE NODE
    socket.on("node:move", async (payload = {}, ack) => {
        const { position } = payload;

        if (
            !position ||
            !Number.isFinite(position.x) ||
            !Number.isFinite(position.y)
        ) {
            return ack?.({ success: false, message: "Invalid node position" });
        }

        await performNodeMutation(
            socket,
            payload,
            ack,
            "node:move",
            (nodes, edges) => {
                const index = nodes.findIndex(node => node.id === payload.nodeId);

                if (index === -1) return { error: "Node not found" };

                const updatedNode = {
                    ...nodes[index],
                    position
                };

                const updatedNodes = [...nodes];
                updatedNodes[index] = updatedNode;

                return {
                    nodes: updatedNodes,
                    edges,
                    payload: {
                        nodeId: payload.nodeId,
                        position
                    },
                    response: { node: updatedNode }
                };
            }
        );
    });


    // DELETE NODE
    socket.on("node:delete", async (payload = {}, ack) => {
        await performNodeMutation(
            socket,
            payload,
            ack,
            "node:delete",
            (nodes, edges) => {
                const nodeExists = nodes.some(node => node.id === payload.nodeId);

                if (!nodeExists) return { error: "Node not found" };

                const updatedNodes = nodes.filter(
                    node => node.id !== payload.nodeId
                );

                const updatedEdges = edges.filter(
                    edge =>
                        edge.source !== payload.nodeId &&
                        edge.target !== payload.nodeId
                );

                return {
                    nodes: updatedNodes,
                    edges: updatedEdges,
                    payload: {
                        nodeId: payload.nodeId
                    },
                    response: {
                        deletedNodeId: payload.nodeId,
                        deletedEdgesCount: edges.length - updatedEdges.length
                    }
                };
            }
        );
    });

}