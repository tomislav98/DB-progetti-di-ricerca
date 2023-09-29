import './home.scss'
import Post from './Post/Post';

function Home() {

    return (
        <div className="container mainpage-container">
            <div className='row'>
                <div className='col-12'>
                    <h3 className='pb-4 mb-4 fst-italic border-bottom'>Your feed</h3>
                </div>
                <div className='col-12'>
                    <Post/>
                </div>
                <div className='col-12'>
                    <Post/>
                </div>
                <div className='col-12'>
                    <Post/>
                </div>
            </div>
        </div>
    )
}

export default Home;