/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import Buttons from './Buttons';

const Navbar = ({
  setAll,
  setBreakfast,
  setLunch,
  setDinner,
  setShakes,
  selectedDiningHall,
  searchQuery,
}) => {
  const breakpoints = [576, 768, 992, 1200];

  const mq = breakpoints.map((bp) => `@media (max-width: ${bp}px)`);

  // Determine the display name
  const displayName = selectedDiningHall || (searchQuery ? `Search: ${searchQuery}` : 'Menu');

  return (
    <div
      className="Navbar"
      css={css`
        display: flex;
        justify-content: space-around;
        align-items: center;

        .logo {
          font-size: 1.2rem; /* Default smaller size */
          font-weight: bold;
        }

        ${mq[2]} {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          place-items: center;

          .Buttons {
            grid-row: 2;
            grid-column: 1/4;
          }

          .logo {
            grid-row: 1;
            grid-column: 1/4;
            position: relative;
            bottom: 10px;
            font-size: 2rem; /* Larger size for medium screens */
          }

          .dwu {
            grid-row: 1;
            grid-column: 1/4;
            position: relative;
            top: 20px;
            font-weight: 400;
            font-size: 1rem; /* Reduced font size for tagline */
          }
        }

        ${mq[0]} {
          .logo {
            font-size: 1rem; /* Even smaller for small screens */
          }

          .dwu {
            font-size: 0.8rem; /* Adjust tagline size for small screens */
          }
        }
      `}
    >
      <h4 className="logo">{displayName}</h4>
      <Buttons
        className="Buttons"
        setAll={setAll}
        setBreakfast={setBreakfast}
        setLunch={setLunch}
        setDinner={setDinner}
        setShakes={setShakes}
      />
      <h3 className="dwu">dine with us.</h3>
    </div>
  );
};

export default Navbar;
