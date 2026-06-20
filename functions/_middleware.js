export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);

  if (url.pathname !== "/") {
    return context.next();
  }

  const cookie = request.headers.get("cookie") || "";
  const savedLanguage = cookie.match(/(?:^|;\s*)clc_lang=(tr|en)(?:;|$)/);

  if (savedLanguage) {
    return Response.redirect(new URL(`/${savedLanguage[1]}/`, url), 302);
  }

  const country = request.cf?.country || request.headers.get("cf-ipcountry") || "";
  const language = country.toUpperCase() === "TR" ? "tr" : "en";

  return Response.redirect(new URL(`/${language}/`, url), 302);
}
