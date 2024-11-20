import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const OrderStatus = () => {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:9999/api/manager/order-status/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const sortedStatuses = response.data.data
          .map((status, index) => ({
            ...status,
            draggableId: `status-${status.status_id || index}`, // Tạo ID duy nhất
          }))
          .sort((a, b) => a.status_index - b.status_index);

        console.log("Fetched statuses:", sortedStatuses);
        setStatuses(sortedStatuses);
      } catch (error) {
        console.error("Error fetching order statuses:", error);
      }
    };
    fetchStatuses();
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return; // Stop if no destination

    const reorderedStatuses = Array.from(statuses);
    const [removed] = reorderedStatuses.splice(result.source.index, 1);
    reorderedStatuses.splice(result.destination.index, 0, removed);

    const updatedStatuses = reorderedStatuses.map((status, index) => ({
      ...status,
      status_index: index + 1,
    }));

    setStatuses(updatedStatuses);

    const token = localStorage.getItem("token");
    axios
      .post(
        "http://localhost:9999/api/manager/order-status/update-order",
        updatedStatuses,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => console.log("Status order updated successfully!"))
      .catch((error) =>
        console.error("Error updating status order:", error)
      );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Status Management</h1>
      {statuses.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
         <Droppable droppableId="statuses">
  {(provided) => {
    const { innerRef, droppableProps, placeholder } = provided ?? {}; // Default if undefined
    return (
      <div
        ref={innerRef}
        {...droppableProps}
        className="flex flex-col gap-4"
      >
        {statuses.map((status, index) => (
          <Draggable
            key={status.status_id.toString()}
            draggableId={status.status_id.toString()}
            index={index}
          >
            {(provided) => {
              const { innerRef, draggableProps, dragHandleProps } = provided ?? {}; // Default if undefined
              return (
                <div
                  ref={innerRef}
                  {...draggableProps}
                  {...dragHandleProps}
                  className="bg-blue-100 border border-blue-500 text-blue-700 rounded-lg px-4 py-2"
                >
                  <p className="font-bold">{status.status_name}</p>
                  <p className="text-sm text-gray-500">
                    Thứ tự: {status.status_index}
                  </p>
                </div>
              );
            }}
          </Draggable>
        ))}
        {placeholder}
      </div>
    );
  }}
</Droppable>

        </DragDropContext>
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
};

export default OrderStatus;
