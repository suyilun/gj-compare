import React from 'react';
import Head from '../Home/Top'
import Content from '../Home/Content'




class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Head/>
                <Content/>
            </div>

        )
    }

}

export default Main




