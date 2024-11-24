/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import Buttons from './Buttons';

const Navbar = ({
  setAll,
  setBreakfast,
  setLunch,
  setDinner,
  selectedDiningHall,
  all,
  breakfast,
  lunch,
  dinner,
}) => {
  const breakpoints = [576, 768, 992, 1200];

  const mq = breakpoints.map((bp) => `@media (max-width: ${bp}px)`);

  // Determine the display name
  const displayName = selectedDiningHall || 'All Dining Halls';

  // Get selected meal times
  const getSelectedMealTimes = () => {
    if (all) {
      return 'All Meals';
    } else {
      const selectedMeals = [];
      if (breakfast) selectedMeals.push('breakfast');
      if (lunch) selectedMeals.push('lunch');
      if (dinner) selectedMeals.push('dinner');
      return selectedMeals.join(', ') || 'No Meal Selected';
    }
  };

  const mealTimes = getSelectedMealTimes();

  return (
    <div
      className="Navbar"
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;

        .logo {
          font-size: 1.2rem;
          font-weight: bold;
        }

        .meal-times {
          font-size: 1rem;
          font-weight: normal;
          margin-top: 0.5rem;
        }

        ${mq[2]} {
          display: flex;
          flex-direction: column;



          .logo {
            font-size: 2rem;
          }

          .meal-times {
            font-size: 1rem;
          }

          .dwu {
            font-size: 1rem;
          }
        }

        ${mq[0]} {
          .logo {
            font-size: 1rem;
          }

          .meal-times {
            font-size: 0.8rem;
          }

          .dwu {
            font-size: 0.8rem;
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
        all={all}
        breakfast={breakfast}
        lunch={lunch}
        dinner={dinner}
      />
      <h3 className="dwu">dine with us.</h3>
    </div>
  );
};

export default Navbar;
