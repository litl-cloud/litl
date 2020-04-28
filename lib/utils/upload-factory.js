// const semaphore = require('semaphore');

function factory(deployList) {
  // const sem = semaphore(1);
  let idx = -1;

  return {
    next(cb) {
      // sem.take(() => {
      idx += 1;
      // console.log('idx', idx);
      //   sem.leave();
      // });
      if (idx > deployList.length) return null;
      return deployList[idx];
    },
  };
}

module.exports = factory;
