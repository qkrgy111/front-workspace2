const cards = {
      test_ready: testReadyComp(),
      test_wait: document.getElementById('test-wait'),
      test_wait_click: document.getElementById('test-wait-click'),
      test_clicked: document.getElementById('test-clicked'),
      test_record: document.getElementById('test-record')
    };

    const main = document.getElementById('main');
    const progressBar = document.getElementById('progress-bar');
    let measureResult = [];
    let measure_start_time, measure_end_time, measure_id, tooFastClickHandler;

    function replaceCard(card) {
      const currCard = main.firstElementChild;
      const clone = card.cloneNode(true);
      clone.style.display = '';
      if (currCard) main.replaceChild(clone, currCard);
      else main.appendChild(clone);
    }

    function testReadyComp() {
      const wrapper = document.createElement('div');
      wrapper.id = 'test-ready';

      const icon = document.createElement('div');
      icon.classList.add('main-icon');
      wrapper.appendChild(icon);

      const title = document.createElement('div');
      title.classList.add('title');
      title.innerText = 'React Time Test';
      wrapper.appendChild(title);

      const button = document.createElement('button');
      button.id = 'start-button';
      button.classList.add('test-start-button');
      button.innerText = 'Start';
      wrapper.appendChild(button);

      return wrapper;
    }

    function bindStartButton() {
      const startBtn = document.getElementById('start-button');
      if (startBtn) {
        startBtn.addEventListener('click', startWaitHandler);
      }
    }

    function startWaitHandler() {
      replaceCard(cards.test_wait);
      main.classList.remove('measure-end', 'finish');
      main.classList.add('waiting');
      waitClick();
    }

    function waitClick() {
      main.removeEventListener('click', startWaitHandler);
      measure_id = setTimeout(measureStart, Math.floor(Math.random() * 4501) + 500);

      tooFastClickHandler = () => {
        clearTimeout(measure_id);
        main.removeEventListener('click', tooFastClickHandler);
        alert('Fail! Clicked too early');
        main.classList.remove('waiting');
        measureResult = [];
        replaceCard(cards.test_ready);
        bindStartButton();
      };

      setTimeout(() => {
        main.addEventListener('click', tooFastClickHandler);
      }, 10);
    }

    function measureStart() {
      measure_start_time = new Date().getTime();
      main.classList.remove('waiting');
      replaceCard(cards.test_wait_click);
      main.removeEventListener('click', tooFastClickHandler);
      main.addEventListener('click', measureEnd);
    }

    function measureEnd() {
      measure_end_time = new Date().getTime();
      const result = measure_end_time - measure_start_time;
      measureResult.push(result);
      updateProgressBar(measureResult.length);
      

      if (measureResult.length < 5) {
        const to_show = cards.test_clicked;
        to_show.querySelector('.millisec').innerText = `${result}ms`;
        main.classList.add('measure-end');
        replaceCard(to_show);
        main.removeEventListener('click', measureEnd);
        main.addEventListener('click', startWaitHandler);
      } else {
        const records = getRecords();
        const to_show = cards.test_record;

        to_show.querySelector('.avg-time .millisec').innerText = `${records.avg}ms`;
        to_show.querySelector('.best-time .millisec').innerText = `${records.min}ms`;
        to_show.querySelector('.worst-time .millisec').innerText = `${records.max}ms`;

        main.classList.add('finish');
        replaceCard(to_show);
        bindTryAgainButton();
        main.removeEventListener('click', measureEnd);
      }
    }
    
  function updateProgressBar(count) {
    const fill = document.querySelector('#progress-bar .progress-fill');
    const text = document.querySelector('#progress-bar .progress-text');

    const percent = (count / 5) * 100;
    fill.style.width = `${percent}%`;
    text.innerText = `${count} / 5`;
  }

    function bindTryAgainButton() {
  const tryAgainBtn = document.querySelector('.try-again-button');
    if (tryAgainBtn) {
      tryAgainBtn.addEventListener('click', () => {
        measureResult = [];
        updateProgressBar(0);
        replaceCard(cards.test_ready);
        bindStartButton();
      });
    }
  }

    function getRecords() {
      const records = { max: null, min: null, avg: -1 };
      let sum = 0;
      for (let r of measureResult) {
        if (records.max === null || r > records.max) records.max = r;
        if (records.min === null || r < records.min) records.min = r;
        sum += r;
      }
      records.avg = Math.round(sum / measureResult.length);
      return records;
    }

    

    replaceCard(cards.test_ready);
    bindStartButton();