function wait(duration) {
  return new Promise(resolve => setTimeout(resolve, duration))
}

module.exports = ({ filter }) => {
  filter('items.read', async (input) => {
    await wait(1000);
    return input;
  })

  filter('items.update', async (input) => {
    await wait(1000)
    if (input.title === 'err') {
      throw new Error('Oups, wrong value!');
    }
    return input;
  })
}