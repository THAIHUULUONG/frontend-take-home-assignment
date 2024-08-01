import { useState } from "react";

import { api } from "@/utils/client/api";

/**
 * QUESTION 1:
 * -----------
 * Style the "Add" button so that it looks like the design in Figma.
 *
 * NOTE: You must use tailwindcss and className. Do not use other methods (eg.
 * inline styles, separate css files, css modules, etc.) unless absolutely
 * necessary. This applies to all styling-related questions in this assignment.
 *
 * Documentation references:
 *  - https://tailwindcss.com
 *  - https://www.youtube.com/watch?v=mr15Xzb1Ook
 *
 *
 *
 * QUESTION 2:
 * -----------
 * Currently our form is not keyboard accessible. Users cannot hit
 * <Enter> right after typing to submit the form (add new todo). Fix this issue.
 */

export const CreateTodoForm = () => {
  const [todoBody, setTodoBody] = useState("");

  const apiContext = api.useContext();

  const { mutate: createTodo, isLoading: isCreatingTodo } =
    api.todo.create.useMutation({
      onSuccess: () => {
        apiContext.todo.getAll.refetch();
      },
    });

  return (
    <form className="group flex items-center justify-between rounded-12 border border-gray-200 py-2 pr-4 focus-within:border-gray-400">
      <label
        htmlFor={TODO_INPUT_ID}
        className="font-manrope sr-only text-[16px] font-bold leading-[24px]"
      >
        Add todo
      </label>

      <input
        id={TODO_INPUT_ID}
        type="text"
        placeholder="Add todo"
        value={todoBody}
        onChange={(e) => {
          setTodoBody(e.target.value);
        }}
        className="flex-1 px-4 text-base placeholder:text-gray-400 focus:outline-none"
      />

      <button
        type="submit"
        disabled={isCreatingTodo}
        className="font-manrope ml-4 rounded-full bg-[#334155] px-4 py-2 text-[14px] font-bold leading-[20px] text-white transition duration-150 ease-in-out hover:bg-[#1e293b] disabled:bg-[#475569]" // Style the button
        onClick={() => {
          createTodo({
            body: todoBody,
          });
          setTodoBody("");
        }}
      >
        Add
      </button>
    </form>
  );
};

const TODO_INPUT_ID = "todo-input-id";
