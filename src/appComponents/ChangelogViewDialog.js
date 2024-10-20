import { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import Markdown from "react-native-markdown-display";
import PropTypes from "prop-types";

import { Dialog } from "components/Dialog";
import { FormItem } from "components/FormItem";
import { LoadingIcon } from "components/LoadingIcon";
import { ScrollView } from "components/ScrollView";
import { VView } from "components/VView";
import { API } from "service/api";
import { VersionNumberInfoText } from "./VersionNumberInfoText";

const changelogUrl =
  "https://raw.githubusercontent.com/SteRiccio/my-arena-mobile/main/";
const changelogUri = "CHANGELOG.md";

export const ChangelogViewDialog = (props) => {
  const {
    onClose,
    onUpdate = null,
    showCurrentVersionNumber = true,
    title = "app:changelog",
  } = props;

  const theme = useTheme();
  const [content, setContent] = useState(null);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        formItem: { backgroundColor: "transparent" },
        markdown: {
          body: {
            color: theme.colors.onBackground,
            backgroundColor: theme.colors.surfaceVariant,
          },
        },
        dialog: { display: "flex", height: "90%", padding: 5 },
        content: {
          display: "flex",
          height: "80%",
          gap: 20,
          backgroundColor: theme.colors.surfaceVariant,
        },
        changelogContent: { flex: 1 },
      }),
    [theme]
  );

  useEffect(() => {
    API.getFileAsText(changelogUrl, changelogUri).then((text) => {
      setContent(text);
    });
  }, []);

  return (
    <Dialog
      actions={onUpdate ? [{ onPress: onUpdate, textKey: "app:update" }] : []}
      onClose={onClose}
      style={styles.dialog}
      title={title}
    >
      <VView style={styles.content}>
        {showCurrentVersionNumber && (
          <FormItem labelKey="app:currentVersion" style={styles.formItem}>
            <VersionNumberInfoText includeUpdateTime={false} />
          </FormItem>
        )}
        {!content && <LoadingIcon />}
        {content && (
          <ScrollView style={styles.changelogContent} persistentScrollbar>
            <Markdown style={styles.markdown}>{content}</Markdown>
          </ScrollView>
        )}
      </VView>
    </Dialog>
  );
};

ChangelogViewDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
  showCurrentVersionNumber: PropTypes.bool,
  title: PropTypes.string,
};
