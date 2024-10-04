window.addEventListener('load', function() {
    const N = document.getElementById('N');
    const barContainer = document.getElementById('bar-container');
    const canvas = document.getElementById('line-canvas');
    const ctx = canvas.getContext('2d');

    // 캔버스 크기 설정
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let barWidth = barContainer.offsetWidth;
    let speed = barWidth / 2; // 2초에 바 전체를 지나가는 속력 (px/s)
    let direction = 1; // 1: 오른쪽, -1: 왼쪽
    let position = 0; // 바 위의 N의 현재 위치 (0 ~ barWidth)
    let lastTime = null;

    let isPaused = false;
    const pauseDuration = 1000; // 1초 (밀리초 단위)
    let pauseEndTime = 0;

    let a = null;
    let b = null;

    // 애니메이션 함수
    function animate(time) {
        if (!lastTime) lastTime = time;
        let delta = (time - lastTime) / 1000; // 초 단위
        lastTime = time;

        if (isPaused) {
            if (time >= pauseEndTime) {
                isPaused = false;
            } else {
                requestAnimationFrame(animate);
                return;
            }
        }

        // 위치 업데이트
        position += direction * speed * delta;
        if (position >= barWidth) {
            position = barWidth;
            direction = -1;
        } else if (position <= 0) {
            position = 0;
            direction = 1;
        }

        // N의 위치 업데이트
        N.style.left = `${position}px`;

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    // 스페이스 바 이벤트 핸들러
    window.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            if (!isPaused) {
                isPaused = true;
                pauseEndTime = performance.now() + pauseDuration;

                // N의 중심 x좌표 계산
                let NRect = N.getBoundingClientRect();
                let centerX = NRect.left + NRect.width / 2;

                // 하늘색 선 그리기
                ctx.strokeStyle = 'skyblue';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(centerX, 0);
                ctx.lineTo(centerX, canvas.height);
                ctx.stroke();

                // 변수 a와 b에 저장
                if (a === null) {
                    a = centerX;
                } else if (b === null) {
                    b = centerX;
                    alert(`a: ${a.toFixed(2)}, b: ${b.toFixed(2)}`);
                }
            }
        }
    });

    // 창 크기 조절 시 캔버스 및 바 크기 업데이트
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        barWidth = barContainer.offsetWidth;
        speed = barWidth / 2;
    });
});
