/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react";

const Buttons = ({
  setAll,
  setBreakfast,
  setLunch,
  setDinner,
  all,
  breakfast,
  lunch,
  dinner,
}) => {
  const breakpoints = [576, 768, 992, 1200];

  const mq = breakpoints.map((bp) => `@media (max-width: ${bp}px)`);

  return (
    <div
      className="Buttons"
      css={css`
        display: flex;

        button {
          margin: 0 2rem;
          border: none;
          padding: 10px;
          cursor: pointer;
          transition: 0.3s linear;
          outline: none;
          background-color: transparent;

          ${mq[2]} {
            margin: 0 1rem;
          }
          ${mq[0]} {
            margin: 0;
            margin-top: 2rem;
          }

          &::after {
            content: "";
            display: block;
            height: 2px;
            width: 0;
            background: #24242a;
            transition: width 0.3s ease-in;
          }

          &:hover::after {
            width: 100%;
          }

          &.active {
            font-weight: bold;
            background-color: #eee;
          }

          span {
            padding: 0 5px;
            font-family: "Poppins", sans-serif;
            font-weight: 600;
            font-size: 1rem;
            margin: auto;

            ${mq[2]} {
              padding: 0;
            }
            ${mq[0]} {
              font-size: 0.9rem;
            }
          }
        }
      `}
    >
      <button
        className={all ? "active" : ""}
        onClick={() => {
          setAll(true);
          setBreakfast(false);
          setLunch(false);
          setDinner(false);
        }}
      >
        <span>All</span>
      </button>

      <button
        className={breakfast ? "active" : ""}
        onClick={() => {
          setAll(false);
          setBreakfast(true);
          setLunch(false);
          setDinner(false);
        }}
      >
        <span>Breakfast</span>
      </button>

      <button
        className={lunch ? "active" : ""}
        onClick={() => {
          setAll(false);
          setBreakfast(false);
          setLunch(true);
          setDinner(false);
        }}
      >
        <span>Lunch</span>
      </button>

      <button
        className={dinner ? "active" : ""}
        onClick={() => {
          setAll(false);
          setBreakfast(false);
          setLunch(false);
          setDinner(true);
        }}
      >
        <span>Dinner</span>
      </button>
    </div>
  );
};

export default Buttons;
