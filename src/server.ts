import { serverHttp } from "./http";
import "./websocket";

const PORT = process.env.PORT || 3001;
serverHttp.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
