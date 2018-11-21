import React, {Component} from 'react';
import axios from 'axios';
import SubmitAnswer from './SubmitAnswer';
import auth0Client from '../Auth';

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: null,
      title: '',
      description: '',

    };
    this.submitAnswer = this.submitAnswer.bind(this)
  }

  updateTitle = (e) => {
    this.setState({ title: e.target.value }) };

    makeEditable() {

    }
  async componentDidMount() {
    await this.refreshQuestion()
  }

  async refreshQuestion() {
    const { match: { params } } = this.props;
    const question = (await axios.get(`http://localhost:8081/${params.questionId}`)).data;
    this.setState({
      question,
    });
  }

  async submitAnswer(answer) {
    await axios.post(`http://localhost:8081/answer/${this.state.question.id}`, {
      answer,
    }, {
      headers: { 'Authorization': `Bearer ${auth0Client.getIdToken()}` }
    });
    await this.refreshQuestion();
  }

  async deleteQuestion() {
    const id = this.props.match.params.questionId
    console.log("Params", this.props.match.params.questionId)
    await axios.delete(`http://localhost:8081/${id}`,
    { 
      headers: {'Authorization': `Bearer ${auth0Client.getIdToken()}` }
    }
    )
    this.props.history.push('/')
  }
  
  async updateQuestion() {
    let question = {}
    question.title = "hello"
    console.log('question', question);
    const id = this.props.match.params.questionId
    // console.log("ID: ", id)
    // console.log("ID TOKEN", auth0Client.getIdToken())
    await axios.put(`http://localhost:8081/${id}`, question,
      { 
        headers: {'Authorization': `Bearer ${auth0Client.getIdToken()}` }
      }
    )
    // this.props.history.push('/')
  }


  render() {
    const {question} = this.state;
    if (question === null) return <p>Loading ...</p>;
    return (
      <div className="container">
        <div className="row">
          <div className="jumbotron col-12">
            <h1 className="display-3" onDoubleClick={this.makeEditable}>{question.title}</h1>
            <p className="lead">{question.description}</p>
            <hr className="my-4" />
            <button onClick={() => {this.deleteQuestion()}}>DELETE</button>
            <button onClick={() => {this.updateQuestion()}}>UPDATE</button>
            <SubmitAnswer questionId={question.id} submitAnswer={this.submitAnswer} />
            <p contentEditable="true">Answers:</p>
            {
              question.answers.map((answer, idx) => (
                <p className="lead" key={idx}>{answer.answer}</p>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Question;