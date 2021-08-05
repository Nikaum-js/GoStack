const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());

/**
 * Métodos HTTP:
 * 
 * GET: Buscar informações do back-end
 * POST: Criar uma informação no back-end
 * PUT/PATH: Alterar uma informação no back-end
 * DELETE: Deletar uma informação no back-end
 */

/**
 * Tipos de parâmetros:
 * 
 * Query Params: Filtros e paginação 
 * Routes Params: Identificar recursos (Atualizar/Delete)
 * Request Body: Conteúdo na hora de criar e editar um recurso (JSON)
 *  
 */
/**
 * Middleware: 
 * 
 * Interceptador de requisições que interromper a requisição ou pode alterar dados da requisição
 */

const projects = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next(); //Faz o código continuar de onde parou. Next = próximo

  console.timeEnd(logLabel)
}

function validadeProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'invalid project ID.' });
  }

  return next();
}

app.use(logRequests);
app.use('/projects/:id', validadeProjectId);

app.get('/projects', (request, response) => {
  const { title } = request.query;

  const results = title
  ? projects.filter(project => project.title.includes(title))
  : projects;

  return response.json(results);

})

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);

  return response.json(project);

})

app.put('/projects/:id', (request, response) => {

  // const params = request.params;

  // console.log(params)

  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found!" })
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found!" })
  }

  projects.slice(projectIndex, 1);

  return response.status(204).send();
})

app.listen(3333, () => {
  return console.log('🚀 Back-end started!');
})

