////////// export
module.exports.apply = apply;

////////// function
async function apply(item, prev, next, state, environment){
    const thisState = {
        item: item,
        prev: prev,
        next: next,
        state: state,
        environment: environment
    };
    if(item.in.assign){
        for(const target in item.in.assign){
            const fromValue = getValueFrom(target, thisState);
            if(fromValue){
                const toFqdn = item.in.assign[target];
                if(toFqdn){
                    setValueTo(fromValue, toFqdn, thisState);
                }
            }
        }
    }
}

function getValueFrom(fromFqdn, thisState){
    if(fromFqdn){
        let value = thisState;
        const keyList = fromFqdn.split('.');
        for(const key of keyList){
            const trimKey = key.trim();
            const targetValue = value[trimKey];
            if(targetValue){
                value = targetValue;
            }else{
                return;
            }
        }
        return value;
    }
}
function setValueTo(fromValue, toFqdn, thisState){
    if(toFqdn){
        let value = thisState;
        const keyList = toFqdn.split('.');
        for(const [index, key] of keyList.entries()){
            const trimKey = key.trim();
            if(!trimKey){
                return;
            }

            if(index === (keyList.length - 1)){// last index
                const lastKey = keyList[keyList.length - 1];
                if(lastKey){
                    value[lastKey] = fromValue;
                    return;
                }
            }


            if(typeof(value[trimKey]) !== 'object'){
                // override object
                value[trimKey] = {};
            }
            value = value[trimKey];
        }
    }
}
