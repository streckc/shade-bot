
class Command {
  constructor() {
    this.command = '';
    this.scope = [];
    this.args = [];
  }

  isFor(name) {
    if (typeof(name) != 'string' || name.length < 1) return false;
    if (this.scope.length === 0) return true;
    for (let x = 0; x < this.scope.length; x++) {
      if (name.match(this.scope[x])) return true;
    }
    return false;
  }
};

const tokenizeText = (text) => {
  const tokens = [];
  let token = null;
  let end = ' ';

  if (typeof(text) != 'string')
    return null;

  token = '';
  for (let x = 0; x < text.length; x++) {
    if (text[x] == end && token != '') {
      tokens.push(token);
      end = ' ';
      token = '';
    }
    else if (token == '' && ['"', "'"].includes(text[x])) {
      end = text[x];
    }
    else if (text[x] != end) {
      token += text[x];
    }
  }

  if (token) { tokens.push(token); }

  return tokens;
}

const parseTokens = (tokens) => {
  const command = new Command();

  if (!Array.isArray(tokens))
    return null;

  if (tokens.length > 0) {
    command.command = tokens[0];
    for (let x = 1; x < tokens.length; x++) {
      if (tokens[x] && tokens[x][0] == '@') {
        if (tokens[x].length > 1)
          command.scope.push(tokens[x].substring(1));
      } else {
        command.args.push(tokens[x]);
      }
    }
  }

  return command;
}

const parseCommand = (text) => {
  if (typeof(text) != 'string')
    return null;

  if (text.length < 2 || text[0] != '!')
    return null;

  const tokens = tokenizeText(text.substring(1));
  const command = parseTokens(tokens);

  return command;
}


module.exports = {
  tokenizeText,
  parseTokens,
  parseCommand
};
