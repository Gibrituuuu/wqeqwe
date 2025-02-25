// Функция для создания случайных звезд
function createStars(container, count, className, size, delay) {
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.classList.add(className);
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDelay = `${Math.random() * delay}s`;
        container.appendChild(star);

        setTimeout(() => {
            star.style.opacity = 0;
            setTimeout(() => {
                star.style.opacity = 1;
            }, Math.random() * 5000);
        }, 0);
    }
}

// Создаём звёзды
const starsContainer = document.getElementById('stars');
createStars(starsContainer, 300, 'star', 2, 2);

// Анимация сердечка
let c = document.getElementById('heart-canvas'),
    $ = c.getContext('2d'),
    w = c.width = innerWidth,
    h = c.height = innerHeight,
    random = Math.random;

$.fillStyle = 'black';
$.fillRect(0, 0, w, h);

let heartPos = function (rad) {
    return [Math.pow(Math.sin(rad), 3), -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))];
};

let scaleAndTranslate = function (pos, sx, sy, dx, dy) {
    return [dx + pos[0] * sx, dy + pos[1] * sy];
};

window.addEventListener('resize', function () {
    w = c.width = innerWidth;
    h = c.height = innerHeight;
    $.fillStyle = 'black';
    $.fillRect(0, 0, w, h);
});

let traceCount = 50,
    pointsOrigin = [],
    dr = 0.1,
    i;

for (i = 0; i < Math.PI * 2; i += dr) {
    pointsOrigin.push(scaleAndTranslate(heartPos(i), 210, 13, 0, 0));
}

for (i = 0; i < Math.PI * 2; i += dr) {
    pointsOrigin.push(scaleAndTranslate(heartPos(i), 150, 9, 0, 0));
}

for (i = 0; i < Math.PI * 2; i += dr) {
    pointsOrigin.push(scaleAndTranslate(heartPos(i), 90, 5, 0, 0));
}

let heartPointsCount = pointsOrigin.length,
    targetPoints = [];

let pulse = function (kx, ky) {
    for (i = 0; i < pointsOrigin.length; i++) {
        targetPoints[i] = [];
        targetPoints[i][0] = kx * pointsOrigin[i][0] + w / 2;
        targetPoints[i][1] = ky * pointsOrigin[i][1] + h / 2;
    }
};

let e = [];
for (i = 0; i < heartPointsCount; i++) {
    let x = random() * w;
    let y = random() * h;
    
    e[i] = {
        vx: 0,
        vy: 0,
        R: 2,
        speed: random() + 5,
        q: ~~(random() * heartPointsCount),
        D: 2 * (i % 2) - 1,
        force: 0.2 * random() + 0.7,
        f: 'hsla(0,' + ~~(40 * random() + 60) + '%,' + ~~(60 * random() + 20) + '%,.3)',
        trace: []
    };
    
    for (let k = 0; k < traceCount; k++) {
        e[i].trace[k] = { x: x, y: y };
    }
}

let config = {
    traceK: 0.4,
    timeDelta: 0.01
};

let time = 0;
let loop = function () {
    let n = -Math.cos(time);
    
    pulse((1 + n) * 0.5, (1 + n) * 0.5);
    
    time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? 0.2 : 1) * config.timeDelta;
    
    $.fillStyle = 'rgba(0,0,0,.1)';
    $.fillRect(0, 0, w, h);
    
    for (i = e.length; i--;) {
        let u = e[i],
            q = targetPoints[u.q],
            dx = u.trace[0].x - q[0],
            dy = u.trace[1].y - q[1],
            length = Math.sqrt(dx * dx + dy * dy);
        
        if (10 > length) {
            if (0.95 < random()) {
                u.q = ~~(random() * heartPointsCount);
            } else {
                if (0.99 < random()) {
                    u.D *= -1;
                }
                
                u.q += u.D;
                u.q %= heartPointsCount;
                
                if (0 > u.q) {
                    u.q += heartPointsCount;
                }
            }
        }
        
        u.vx += (-dx / length) * u.speed;
        u.vy += (-dy / length) * u.speed;
        
        u.trace[0].x += u.vx;
        u.trace[0].y += u.vy;
        
        u.vx *= u.force;
        u.vy *= u.force;
        
        for (let k = 0; k < u.trace.length - 1;) {
            let T = u.trace[k];
            let N = u.trace[++k];
            N.x -= config.traceK * (N.x - T.x);
            N.y -= config.traceK * (N.y - T.y);
        }

        $.fillStyle = u.f;
        for (let k = 0; k < u.trace.length; k++) {
            $.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
        }
    }
    
    requestAnimationFrame(loop);
};

loop();

// Логика проверки даты
const today = new Date();
const march8 = new Date(today.getFullYear(), 2, 8); // 8 марта
const march10 = new Date(today.getFullYear(), 2, 10); // 10 марта

const congratsMessage = document.getElementById('congrats-message');
const additionalMessage = document.getElementById('additional-message');

// Функция для вычисления разницы в днях
function getDaysDifference(date1, date2) {
    const timeDiff = date2 - date1;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

// Обновление главной надписи в зависимости от даты
if (today < march8) {
    const daysToMarch8 = getDaysDifference(today, march8);
    congratsMessage.textContent = `До 8 Марта осталось ${daysToMarch8} дней!`;
} else if (today.getMonth() === 2 && today.getDate() === 8) {
    congratsMessage.textContent = "С 8 Марта, дорогая! 💐";
} else if (today >= march10) {
    congratsMessage.textContent = "С Днём Рождения! 🎉";
} else {
    const daysToMarch10 = getDaysDifference(today, march10);
    congratsMessage.textContent = `8 марта уже было!`;
}

// Обработчик клика
document.getElementById('heart-canvas').addEventListener('click', () => {
    const clickMessage = document.getElementById('click-message');
    const stars = document.querySelectorAll('.star');

    // Плавное исчезновение надписи
    clickMessage.style.opacity = '0.8';
    void clickMessage.offsetWidth; // Принудительный рефлоу
    clickMessage.style.animation = 'none';
    clickMessage.classList.add('fade-out');

    // Исчезновение сердечка
    c.style.opacity = '1';
    setTimeout(() => {
        c.style.opacity = '0';
    }, 0);

    // Анимация звезд
    stars.forEach((star) => {
        star.style.opacity = '0';
        setTimeout(() => {
            star.style.opacity = '1';
        }, Math.random() * 2000);
    });

    // Анимация основного сообщения
    anime({
        targets: congratsMessage,
        translateY: '-100vh',
        opacity: 0,
        duration: 2000,
        easing: 'easeInOutQuad',
        complete: () => {
            // Появление дополнительного текста
            if (today < march8) {
                const daysToMarch8 = getDaysDifference(today, march8);
                const daysToMarch10 = getDaysDifference(today, march10);
                additionalMessage.innerHTML = `
                    <div class="message-content">
                        <span class="highlight">Мадам!</span> Ждите 8 марта! До него осталось ещё чуть-чуть, а потом и уже ваш день рождения, а точнее через <span class="accent">${daysToMarch10}</span> дней.
                        <div class="birthday-note">
                            Не забудь открыть этот сайт ещё раз в свой день рождения, жишь! <span class="gift-emoji">🎁</span>
                        </div>
                    </div>
                `;
            } else if (today >= march8 && today < march10) {
                const daysToMarch10 = getDaysDifference(today, march10);
                additionalMessage.innerHTML = `
                    <div class="message-content">
                        <span class="highlight">Мадам!</span> 8 марта уже было, хмм, а теперь осталось ждать <span class="accent">${daysToMarch10}</span> дней до вашего дня рождения!)
                        <div class="birthday-note">
                            Не забудь открыть этот сайт ещё раз в свой день рождения, жишь! <span class="gift-emoji">🎁</span>
                        </div>
                    </div>
                `;
            } else if (today >= march10) {
                additionalMessage.innerHTML = `
                    <div class="message-content">
                        <span class="highlight">Братанчик</span>, поздравляю тебя с Днём Рождения! 🎉
                        <div class="birthday-note">
                            Сегодня твой день, так что наслаждайся им по полной! 🎁
                        </div>
                    </div>
                `;
            }

            anime({
                targets: additionalMessage,
                opacity: 1,
                translateY: 0,
                duration: 1500,
                easing: 'easeOutQuad'
            });
        }
    });
});

// Обработчик движения мыши для звезд
let prevMouseX = 0;
let prevMouseY = 0;
let mouseVelocityX = 0;
let mouseVelocityY = 0;

let starsElements = document.querySelectorAll('.star');
let repelRadius = 100;
let repelStrength = 0.5;
let velocity = [];
let positions = [];

// Инициализация позиций и скоростей
for (let i = 0; i < starsElements.length; i++) {
    velocity.push({ 
        x: Math.random() * 2 - 1, 
        y: Math.random() * 2 - 1 
    });
    const rect = starsElements[i].getBoundingClientRect();
    positions.push({ 
        x: rect.left + rect.width / 2, 
        y: rect.top + rect.height / 2 
    });
}

function updateStars() {
    const mouseX = prevMouseX;
    const mouseY = prevMouseY;

    mouseVelocityX = (mouseX - prevMouseX) / 10;
    mouseVelocityY = (mouseY - prevMouseY) / 10;

    starsElements.forEach((star, index) => {
        const dx = mouseX - positions[index].x;
        const dy = mouseY - positions[index].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < repelRadius) {
            const directionX = dx / distance;
            const directionY = dy / distance;
            const force = (repelRadius - distance) / repelRadius;

            velocity[index].x += -directionX * force * repelStrength * 5;
            velocity[index].y += -directionY * force * repelStrength * 5;
        }

        positions[index].x += velocity[index].x;
        positions[index].y += velocity[index].y;

        velocity[index].x *= 0.95;
        velocity[index].y *= 0.95;

        const maxSpeed = 10;
        if (Math.abs(velocity[index].x) > maxSpeed) {
            velocity[index].x = Math.sign(velocity[index].x) * maxSpeed;
        }
        if (Math.abs(velocity[index].y) > maxSpeed) {
            velocity[index].y = Math.sign(velocity[index].y) * maxSpeed;
        }

        star.style.transform = `translate(
            ${positions[index].x - (star.getBoundingClientRect().left + star.getBoundingClientRect().width / 2)}px, 
            ${positions[index].y - (star.getBoundingClientRect().top + star.getBoundingClientRect().height / 2)}px
        )`;
    });

    requestAnimationFrame(updateStars);
}

document.addEventListener('mousemove', (event) => {
    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
});

updateStars();