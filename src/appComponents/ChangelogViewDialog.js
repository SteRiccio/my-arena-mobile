import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Markdown from "react-native-markdown-display";
import PropTypes from "prop-types";

import { Files } from "utils";

import { Dialog } from "components/Dialog";
import { FormItem } from "components/FormItem";
import { LoadingIcon } from "components/LoadingIcon";
import { ScrollView } from "components/ScrollView";
import { VView } from "components/VView";
import { API } from "service/api";
import { VersionNumberInfoText } from "./VersionNumberInfoText";

const styles = StyleSheet.create({
  dialog: { display: "flex", height: "90%", padding: 5 },
  content: { display: "flex", height: "80%", gap: 20 },
  changelogContent: { flex: 1 },
});

const changelogUrl =
  "https://raw.githubusercontent.com/SteRiccio/my-arena-mobile/main/";
const changelogUri = "CHANGELOG.md";

export const ChangelogViewDialog = (props) => {
  const { onClose, onUpdate } = props;

  const [content, setContent] = useState(null);

  useEffect(() => {
    API.getFile(changelogUrl, changelogUri).then((tempFileUri) => {
      Files.readAsString(tempFileUri).then((contentRead) => {
        setContent(contentRead);
      });
    });
  }, []);

  return (
    <Dialog
      actions={[{ onPress: onUpdate, textKey: "app:update" }]}
      onClose={onClose}
      style={styles.dialog}
      title="app:updateAvailable"
    >
      <VView style={styles.content}>
        <FormItem labelKey="app:currentVersion">
          <VersionNumberInfoText includeUpdateTime={false} />
        </FormItem>
        {!content && <LoadingIcon />}
        {content && (
          <ScrollView style={styles.changelogContent}>
            <Markdown>{content}</Markdown>
          </ScrollView>
        )}
      </VView>
    </Dialog>
  );
};

ChangelogViewDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
