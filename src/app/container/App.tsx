import * as React from 'react'

const mod = global.myModule;
mod.init();

// Import Components
import { StateLess } from '../component';

export class App extends React.Component<any, any> {
	render() {
		return (
			<div style={{marginLeft: '20px'}}>
				<StateLess propName={'StateLess Component'} />
			</div>
		);
	}
}
