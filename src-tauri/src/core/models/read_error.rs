use std::fmt::Display;

#[derive(Debug, Clone)]
pub enum ReadError {
    DialogClosed,
    LoadError(String),
    ParseError(String),
}

impl From<std::io::Error> for ReadError {
    fn from(value: std::io::Error) -> Self {
        ReadError::LoadError(value.to_string())
    }
}

impl From<quick_xml::DeError> for ReadError {
    fn from(value: quick_xml::DeError) -> Self {
        ReadError::ParseError(value.to_string())
    }
}

impl Display for ReadError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ReadError::DialogClosed => {
                write!(f, "The dialog was closed without selecting a folder")
            }
            ReadError::LoadError(e) => write!(f, "Failed to load file: {}", e),
            ReadError::ParseError(e) => write!(f, "Failed to parse XML: {}", e),
        }
    }
}
