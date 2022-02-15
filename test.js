ev
let offsetX = 0
let offsetY = 0
let path = `M ${offsetX} ${offsetY}`

const xValues = new Set()
const yValues = new Set()

for (let i = 1; i <= 15; i++) {
      
      let x1 = 5 * i; xValues.add(x1)
      let y2 = 10 * i; yValues.add(y2)
      let y1 = y2 / 2; yValues.add(y1)
      
      const yMax = Math.max(...yValues) + 10
      
      path = [
            path,
            `Q ${offsetX + x1} ${offsetY + y1}, ${offsetX} ${offsetY + y2}`,
            `M ${offsetX} ${offsetY + yMax}`
      ].join(' ')
      
      offsetY = offsetY + yMax
      xValues.clear()
      yValues.clear()
      
}

jpm.channel.send({ content: path })
'a'