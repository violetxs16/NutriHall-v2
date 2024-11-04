import { motion } from "framer-motion";
import imgAllMenu from "../img/undraw_barbecue.svg";
const MenuAll = ({ all, items }) => {
  const itemContainer = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      {all &&
        items.map((item, i) => (
          <motion.div
            className="menu-items"
            key={item.id}
            variants={itemContainer}
            transition={{ delay: i * 0.2 }}
          >
            <img src={imgAllMenu} alt="food burger" />
            <motion.div className="item-content">
              <motion.div className="item-title-box">
                <motion.h5 className="item-title">{item.title}</motion.h5>
                <motion.h5 className="item-price">${item.price}</motion.h5>
              </motion.div>
              <motion.div className="item-restrictions">
                {item.restrictions.length > 0
                    ? <p>Restrictions: {item.restrictions.join(", ")}</p>
                    : <p>No restrictions</p>}
                </motion.div>
            </motion.div>
          </motion.div>
        ))}
    </>
  );
};

export default MenuAll;
