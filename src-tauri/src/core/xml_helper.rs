use std::{fmt::Display, path::PathBuf};

#[derive(Debug, Clone)]
pub enum Error {
    DialogClosed,
    LoadError(String),
    ParseError(String),
}

pub async fn pick_data_folder<T>() -> Result<Vec<T>, Error>
where
    T: serde::de::DeserializeOwned,
{
    let handle = rfd::AsyncFileDialog::new()
        .set_title("Choose a folder...")
        .pick_folder()
        .await
        .ok_or(Error::DialogClosed)?;

    load_xml_files(handle.path().to_owned()).await
}

async fn load_xml_files<T>(folder: PathBuf) -> Result<Vec<T>, Error>
where
    T: serde::de::DeserializeOwned,
{
    std::fs::read_dir(folder)?
        .into_iter()
        .filter_map(|entry| match entry {
            Err(e) => return Some(Err(e)),
            Ok(dir) => dir
                .path()
                .extension()
                .is_some_and(|s| s.eq_ignore_ascii_case("xml"))
                .then(|| Ok(dir.path())),
        })
        .map(|path| read_xml_data(path?))
        .collect()
}

fn read_xml_data<T>(file: PathBuf) -> Result<T, Error>
where
    T: serde::de::DeserializeOwned,
{
    let content = std::fs::read_to_string(&file)?;

    quick_xml::de::from_str(&content).map_err(Error::from)
}

impl From<std::io::Error> for Error {
    fn from(value: std::io::Error) -> Self {
        Error::LoadError(value.to_string())
    }
}

impl From<quick_xml::DeError> for Error {
    fn from(value: quick_xml::DeError) -> Self {
        Error::ParseError(value.to_string())
    }
}

impl Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Error::DialogClosed => write!(f, "The dialog was closed without selecting a folder"),
            Error::LoadError(e) => write!(f, "Failed to load file: {}", e),
            Error::ParseError(e) => write!(f, "Failed to parse XML: {}", e),
        }
    }
}
