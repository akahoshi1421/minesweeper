import boards from './board.module.scss';
import styles from './index.module.scss';

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={boards.board}>
        <div className={boards.scoreboard}>
          <div className={boards.score} />
          <div className={boards.resetBtn} />
          <div className={boards.score} />
        </div>
      </div>
    </div>
  );
};

export default Home;
