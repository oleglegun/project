global.requestAnimationFrame = callback => setTimeout(callback, 0)

import Enzyme from 'enzyme/build/index'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })
