class RenderHelper {

    constructor () { }

    check(runInterval, deps, timeToCheck, fun) {

        let prevDepsState = [], interval;

        const createInterval = () => {

            let isChanged = 0;

            prevDepsState.map((value, index) => deps[index] === value ?? (isChanged = isChanged + 1));

            if (isChanged > 0) {

                interval = setInterval(fun(), timeToCheck);
                
            } else {

                clearInterval(interval);

            }

        }

        if (runInterval) createInterval();

    }

}

export default RenderHelper;