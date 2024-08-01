import type { SVGProps } from "react";

import { useState } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { api } from "@/utils/client/api";

/**
 * QUESTION 3:
 * -----------
 * A todo has 2 statuses: "pending" and "completed"
 *  - "pending" state is represented by an unchecked checkbox
 *  - "completed" state is represented by a checked checkbox, darker background,
 *    and a line-through text
 *
 * We have 2 backend apis:
 *  - (1) `api.todo.getAll`       -> a query to get all todos
 *  - (2) `api.todoStatus.update` -> a mutation to update a todo's status
 *
 * Example usage for (1) is right below inside the TodoList component. For (2),
 * you can find similar usage (`api.todo.create`) in src/client/components/CreateTodoForm.tsx
 *
 * If you use VSCode as your editor , you should have intellisense for the apis'
 * input. If not, you can find their signatures in:
 *  - (1) src/server/api/routers/todo-router.ts
 *  - (2) src/server/api/routers/todo-status-router.ts
 *
 * Your tasks are:
 *  - Use TRPC to connect the todos' statuses to the backend apis
 *  - Style each todo item to reflect its status base on the design on Figma
 *
 * Documentation references:
 *  - https://trpc.io/docs/client/react/useQuery
 *  - https://trpc.io/docs/client/react/useMutation
 *
 *
 *
 *
 *
 * QUESTION 4:
 * -----------
 * Implement UI to delete a todo. The UI should look like the design on Figma
 *
 * The backend api to delete a todo is `api.todo.delete`. You can find the api
 * signature in src/server/api/routers/todo-router.ts
 *
 * NOTES:
 *  - Use the XMarkIcon component below for the delete icon button. Note that
 *  the icon button should be accessible
 *  - deleted todo should be removed from the UI without page refresh
 *
 * Documentation references:
 *  - https://www.sarasoueidan.com/blog/accessible-icon-buttons
 *
 *
 *
 *
 *
 * QUESTION 5:
 * -----------
 * Animate your todo list using @formkit/auto-animate package
 *
 * Documentation references:
 *  - https://auto-animate.formkit.com
 */

type TodoStatus = "completed" | "pending";

export const TodoList = () => {
  const [filter, setFilter] = useState<"all" | TodoStatus>("all");
  const [parent] = useAutoAnimate<HTMLUListElement>(); // Khai báo hook auto-animate

  const { data: todos = [], refetch } = api.todo.getAll.useQuery({
    statuses: filter === "all" ? ["completed", "pending"] : [filter],
  });

  const updateTodoStatus = api.todoStatus.update.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const handleCheckboxChange = (
    todoId: number,
    checked: boolean | undefined
  ) => {
    updateTodoStatus.mutate({
      todoId,
      status: checked ? "completed" : "pending",
    });
  };

  const handleDelete = (todoId: number) => {
    deleteTodo.mutate({ id: todoId });
  };

  const sortedTodos = todos.slice().sort((a, b) => a.id - b.id);

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`mr-2 rounded-[9999px] border px-4 py-2 ${
            filter === "all"
              ? "border-none bg-[#334155] text-white"
              : "text-[#334155]"
          } font-manrope border-[#E2E8F0] text-[14px] font-bold leading-[20px] transition duration-150 ease-in-out`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`mr-2 rounded-[9999px] border px-4 py-2 ${
            filter === "pending"
              ? "border-none bg-[#334155] text-white"
              : "text-[#334155]"
          } font-manrope border-[#E2E8F0] text-[14px] font-bold leading-[20px] transition duration-150 ease-in-out`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`mr-2 rounded-[9999px] border px-4 py-2 ${
            filter === "completed"
              ? "border-none bg-[#334155] text-white"
              : "text-[#334155]"
          } font-manrope border-[#E2E8F0] text-[14px] font-bold leading-[20px] transition duration-150 ease-in-out`}
        >
          Completed
        </button>
      </div>

      <ul ref={parent} className="grid grid-cols-1 gap-y-3">
        {sortedTodos.map((todo) => (
          <li key={todo.id}>
            <div
              className={`flex items-center rounded-12 border border-[#E2E8F0] px-4 py-3 shadow-sm ${
                todo.status === "completed"
                  ? "bg-[#F8FAFC] text-gray-500 line-through"
                  : ""
              }`}
            >
              <Checkbox.Root
                id={String(todo.id)}
                checked={todo.status === "completed"}
                onCheckedChange={(checked: boolean) =>
                  handleCheckboxChange(todo.id, checked)
                }
                className="flex h-6 w-6 items-center justify-center rounded-6 border border-gray-300 focus:border-gray-700 focus:outline-none data-[state=checked]:border-gray-700 data-[state=checked]:bg-gray-700"
              >
                <Checkbox.Indicator>
                  <CheckIcon className="h-4 w-4 text-white" />
                </Checkbox.Indicator>
              </Checkbox.Root>

              <label
                className="font-inter block pl-3 text-[16px] font-[600] font-bold leading-[24px] text-[#334155]"
                htmlFor={String(todo.id)}
              >
                {todo.body}
              </label>

              <button
                onClick={() => handleDelete(todo.id)}
                aria-label="Delete todo"
                className="ml-auto rounded-[9999px] p-2 hover:bg-gray-200"
              >
                <XMarkIcon className="text-red-500 h-5 w-5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const XMarkIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

const CheckIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
};
