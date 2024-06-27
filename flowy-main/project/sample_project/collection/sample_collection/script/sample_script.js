module.exports = async (item, prev, next, state, environment) => {
    // console.log('item', item);
    // console.log('prev', prev);
    // console.log('next', next);
    // console.log('state', state);
    // console.log('environment', environment);
    // state.body = prev.out.body;
    console.log('prev', prev);
    console.log('next', next);
    next.in.url = next.in.url + '/1';
    next.in.timeout = 9999;
    return 'hogehoge';
}