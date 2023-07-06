import {
  Navbar,
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

function App() {
  const [todo, setTodo] = useState("");
  const [list, setList] = useState([]);
  const [archived, setArchived] = useState(false);
  const [filtered, setFiltered] = useState([]);

  const handleInputChange = (e) => {
    setTodo(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!todo) return;
    const payload = {
      title: todo,
      completed: false,
      archived: false,
      created: new Date(),
    };
    sendRequest(payload);
  };
  const sendRequest = async (payload) => {
    const { data } = await api.post("/todos", payload);
    setTodo("");
    setList([data, ...list]);
    setFiltered([data, ...list]);
  };
  const fetchData = async () => {
    const { data } = await api.get("/todos");
    const sorted = data.sort((a, b) => b.id - a.id);
    setList(sorted);
    setFiltered(sorted);
  };
  const updateStatus = async (id) => {
    const { data } = await api.patch(`/todos/${id}`, { completed: true });
    const updatedTodos = list.map((item) =>
      item.id === id ? { ...data } : item
    );
    setList(updatedTodos);
    !archived
      ? setFiltered(updatedTodos)
      : setFiltered(updatedTodos.filter((item) => item.archived));
  };
  const archiving = async (id, payload) => {
    const { data } = await api.patch(`/todos/${id}`, { archived: payload });
    const updatedTodos = list.map((item) =>
      item.id === id ? { ...data } : item
    );
    setList(updatedTodos);
    !archived
      ? setFiltered(updatedTodos)
      : setFiltered(updatedTodos.filter((item) => item.archived));
  };
  const calculateTime = (time) => {
    const now = moment();
    const timeMoment = moment(time);
    return moment.duration(-now.diff(timeMoment)).humanize(true);
  };
  const showAll = () => {
    setArchived(false);
    setFiltered(list);
  };
  const filterArchive = () => {
    setArchived(true);
    setFiltered(list.filter((item) => item.archived));
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand>Todo-App</Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <Row className="mb-3">
          <Col>
            <Form onSubmit={handleSubmit}>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Input Task</Form.Label>
                <Form.Control
                  onChange={handleInputChange}
                  value={todo}
                  type="text"
                  placeholder="What's your task?"
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
        <Row>
          {archived ? (
            <Button onClick={showAll} variant="primary">
              Show all
            </Button>
          ) : (
            <Button onClick={filterArchive} variant="outline-primary">
              Show archived
            </Button>
          )}
        </Row>
        <Row>
          <Col>
            {filtered.map((item, key) => (
              <Card className="my-3" key={`card-${key}`}>
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {calculateTime(item.created)}
                  </Card.Subtitle>
                  {item.completed ? (
                    <Button variant="success">Completed</Button>
                  ) : (
                    <Button
                      onClick={() => updateStatus(item.id)}
                      variant="warning"
                    >
                      Complete?
                    </Button>
                  )}
                  {item.archived ? (
                    <Button
                      onClick={() => archiving(item.id, false)}
                      variant="info"
                    >
                      Archived
                    </Button>
                  ) : (
                    <Button
                      onClick={() => archiving(item.id, true)}
                      variant="outline-info"
                    >
                      Archive?
                    </Button>
                  )}
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
