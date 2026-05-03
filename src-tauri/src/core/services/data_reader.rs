use std::path::PathBuf;

use crate::core::models::ReadError;

pub async fn pick_dir() -> Result<PathBuf, ReadError> {
    rfd::AsyncFileDialog::new()
        .set_title("Choose a folder...")
        .pick_folder()
        .await
        .map(|file| file.path().to_owned())
        .ok_or(ReadError::DialogClosed)
}

pub fn read_xml_data<T>(file: PathBuf) -> Result<T, ReadError>
where
    T: serde::de::DeserializeOwned,
{
    let content = std::fs::read_to_string(&file)?;

    quick_xml::de::from_str(&content).map_err(ReadError::from)
}

pub fn read_csv_data<T>(file: PathBuf) -> Result<Vec<T>, ReadError>
where
    T: serde::de::DeserializeOwned,
{
    let mut rdr =
        csv::Reader::from_path(&file).map_err(|e| ReadError::LoadError(format!("{:?}", e)))?;
    let mut vec = Vec::new();
    for result in rdr.deserialize() {
        let row: T = result.map_err(|e| ReadError::ParseError(format!("{:?}", e)))?;
        vec.push(row);
    }
    Ok(vec)
}
