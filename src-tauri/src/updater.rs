use tauri_plugin_updater::UpdaterExt;

pub fn update(app: tauri::AppHandle) {
    tauri::async_runtime::spawn(async move {
        if let Err(e) = perform_update(app).await {
            println!("Failed to update: {e}");
        }
    });
}

async fn perform_update(app: tauri::AppHandle) -> tauri_plugin_updater::Result<()> {
  if let Some(update) = app.updater()?.check().await? {
    let mut downloaded = 0;

    update
      .download_and_install(
        |chunk_length, content_length| {
          downloaded += chunk_length;
          println!("downloaded {downloaded} from {content_length:?}");
        },
        || {
          println!("download finished");
        },
      )
      .await?;

    println!("update installed");
    app.restart();
  }

  Ok(())
}