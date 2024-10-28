import server from './server'
import colors from 'colors'

const port = process.env.PORT || 4001

server.listen(port, () => {
    console.log(colors.cyan.bold.italic(`REST api funcionando en el puerto ${port}`));
})