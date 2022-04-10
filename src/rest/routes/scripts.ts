import { adjustScript, editScript } from "../../core/controllers";

export const mutateScript = async (body) => {
  const { editScript: edit, url, userId, script, newScript } = body ?? {};

  try {
    return await (edit ? editScript : adjustScript)(
      Object.assign(
        {},
        {
          url: decodeURIComponent(url + ""),
          userId,
          script,
          newScript,
        }
      )
    );
  } catch (e) {
    console.error(e);
  }
};

const setScripts = async (req, res, next) => {
  try {
    const data = await mutateScript(req.body);

    res.json(data);
  } catch (e) {
    console.error(e);
    next();
  }
};

export { setScripts };
