async function waitUntil(fn, { maxTimes = 3, duration = 500 }) {
    let waitingTimes = 0;
    let isSuccess = false;

    while (waitingTimes < maxTimes) {
        await new Promise((r) => {
            setTimeout(r, duration);
        });

        isSuccess = fn();

        if (isSuccess) {
            break;
        } else {
            waitingTimes += 1;
        }
    }

    return isSuccess;
}

module.exports = waitUntil;
