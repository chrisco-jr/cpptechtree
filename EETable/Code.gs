function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');
  // Build and return HTML in IFRAME sandbox mode.
  return template.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)
.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .getContent();
}
