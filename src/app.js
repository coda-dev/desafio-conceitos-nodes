const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {

  return response.json(repositories);

});

app.post("/repositories", (request, response) => {

  const { url, title, techs } = request.body;

  const repository = { id: uuid(), url, title, techs, likes: 0, };

  repositories.push(repository);

  return response.status(201).json(repository);

});

app.put("/repositories/:id", (request, response) => {

  const { id } = request.params;
  const { url, title, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) {
    response.status(400).json({ error: 'Repository not found!' });
  }

  const repository = {
    id,
    url,
    title,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repositories[repositoryIndex]);

});

app.delete("/repositories/:id", (request, response) => {

  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1);
  } else {
    response.status(400).json({ error: 'Repository not found!' });
  }

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {

  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) {
    response.status(400).json({ error: 'Repository not found!' });
  } else {

    repositories[repositoryIndex].likes++;

    const repository = repositories[repositoryIndex];

    return response.json(repository);

  }

});

module.exports = app;
