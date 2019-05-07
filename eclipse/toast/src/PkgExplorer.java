import static java.nio.file.StandardOpenOption.APPEND;
import static java.nio.file.StandardOpenOption.CREATE;
import static java.nio.file.StandardOpenOption.TRUNCATE_EXISTING;
import static java.util.Collections.emptyList;
import static java.util.Collections.newSetFromMap;
import static java.util.Collections.reverse;
import static java.util.Collections.singletonList;
import static java.util.stream.Collectors.toList;
import static javafx.collections.FXCollections.observableArrayList;
import static javafx.collections.FXCollections.reverse;
import static javafx.scene.input.DataFormat.FILES;
import static sam.fx.alert.FxAlert.showErrorDialog;
import static sam.fx.clipboard.FxClipboard.setContent;
import static sam.fx.helpers.FxMenu.menuitem;
import static sam.fx.popup.FxPopupShop.showHidePopup;
import static sam.io.fileutils.FilesUtilsIO.writeAsString;
import static sam.myutils.MyUtilsException.hideError;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.StandardOpenOption;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;
import java.util.stream.Stream;

import javafx.application.Application;
import javafx.application.Platform;
import javafx.beans.binding.BooleanExpression;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Cursor;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.control.Button;
import javafx.scene.control.ButtonBase;
import javafx.scene.control.ButtonType;
import javafx.scene.control.Label;
import javafx.scene.control.ListView;
import javafx.scene.control.Menu;
import javafx.scene.control.MenuBar;
import javafx.scene.control.MultipleSelectionModel;
import javafx.scene.control.ProgressBar;
import javafx.scene.control.SelectionMode;
import javafx.scene.control.SelectionModel;
import javafx.scene.control.SeparatorMenuItem;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextInputDialog;
import javafx.scene.control.Tooltip;
import javafx.scene.control.TreeCell;
import javafx.scene.control.TreeItem;
import javafx.scene.control.TreeView;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.StackPane;
import javafx.scene.text.Text;
import javafx.stage.DirectoryChooser;
import javafx.stage.Modality;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import sam.fx.alert.FxAlert;
import sam.fx.clipboard.FxClipboard;
import sam.fx.helpers.FxCell;
import sam.fx.helpers.FxConstants;
import sam.fx.popup.FxPopupShop;
import sam.io.BufferSupplier;
import sam.io.fileutils.FileOpenerNE;
import sam.io.fileutils.PathFilter;
import sam.io.serilizers.StringIOUtils;
import sam.myutils.Checker;
import sam.myutils.MyUtilsException;
import sam.myutils.MyUtilsPath;
import sam.nopkg.SavedAsStringResource;
import sam.nopkg.SavedResource;
import sam.reference.WeakAndLazy;
import sam.reference.WeakMap;
import sam.string.StringUtils;
import sam.thread.MyUtilsThread;

public class PkgExplorer extends Application implements EventHandler<KeyEvent> {
	public static void main(String[] args) {
		launch(PkgExplorer.class, args);
	}

	private static final Path SELF_DIR = MyUtilsPath.selfDir();
	private final String notepad_path = System.getenv("NPP_EXE");
	private final SavedResource<Path> current_rootpath = new SavedAsStringResource<>(SELF_DIR.resolve("current_rootpath"), Paths::get);
	private static final Path icons = SELF_DIR.resolve("icons");
	private final Image file_icon, dir_icon, dir_icon_open;

	{
		try {
			file_icon = img("file.png");
			dir_icon = img("folder.png");
			dir_icon_open = img("folder_open.png");
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	private static void println(Object s) {
		System.out.println(s);
	}

	private static class Visited implements AutoCloseable {
		private ObservableList<File> all;
		private List<File> nnew;
		final Path p = SELF_DIR.resolve("visited.txt");
		int mod = 0;

		public void add(File dir) {
			if(nnew == null)
				nnew = new ArrayList<>();

			if(nnew.isEmpty() || !dir.equals(nnew.get(nnew.size() - 1))) {
				nnew.remove(dir);
				nnew.add(dir);
			}
			if(all != null && (all.isEmpty() || !dir.equals(all.get(0)))) {
				all.remove(dir);
				all.add(0, dir);
			}
			mod++;
		}

		@Override
		public void close() throws Exception {
			if(mod == 0)
				return;

			if(all == null)
				writeAsString(p, nnew, CREATE, APPEND);
			else {
				reverse(all);
				writeAsString(p, all, CREATE, TRUNCATE_EXISTING);
			}
		}

		public ObservableList<File> list() {
			if(all != null)
				return all;

			all = observableArrayList();

			if(Files.exists(p)) {
				try {
					Files.lines(p)
					.filter(Checker::isNotEmptyTrimmed)
					.map(File::new)
					.filter(File::exists)
					.forEach(s -> {
						println(s);
						all.remove(s);
						all.add(s);
					});
				} catch (IOException e) {
					e.printStackTrace();
				}
			}

			if(nnew != null)
				all.addAll(nnew);

			reverse(all);
			return all;
		}

		public void remove(File files) {
			mod++;
			all.remove(files);
		}
	}
	private static class Root extends TreeItem<Data> {
		final int name_count ;
		final Path path;
		final int fileCount, dirCount;

		public Root(Path path) throws IOException {
			super();
			this.path = path;
			this.name_count = path.getNameCount();

			HashMap<Path, TreeItem<Data>> map = new HashMap<>();
			int n[] = {0,0};

			Files.walk(path)
			.map(p -> new Data(p, this))
			.peek(f -> {
				if(f.isFile())
					n[0]++;
				else
					n[1]++;
			})
			.filter(Data::isFile)
			.forEach(f -> {
				map.computeIfAbsent(f.path.getParent(), p -> {
					TreeItem<Data> t = new TreeItem<>(new Data(p, false, this));
					getChildren().add(t);
					return t;
				}).getChildren().add(new TreeItem<>(f));
			});

			fileCount = n[0];
			dirCount = n[1];
		}
	}

	private static class Data {
		final Path path;
		String name;
		final boolean isFile;
		final Root root;

		public Data(Path path, Root root) {
			this(path, Files.isRegularFile(path), root);
		}
		public Data(Path path, boolean isFile, Root root) {
			this.path = path;
			this.isFile = isFile;
			this.root = root;
		}
		@Override
		public String toString() {
			if(name != null) return name;
			if(isFile)
				return name = path.getFileName().toString();

			int n = path.getNameCount();

			if(n != root.name_count)
				name = path.subpath(root.name_count, n).toString();
			else
				name = "default package";
			return name;
		}
		public boolean isFile() {
			return isFile;
		}
	}

	private final TreeView<Data> view = new TreeView<>();
	private final BorderPane mainRoot = new BorderPane(view);
	private final Scene mainScene = new Scene(mainRoot);
	private final MultipleSelectionModel<TreeItem<Data>> selection_model = view.getSelectionModel();
	private final Label path = new Label();
	private Stage stage;
	private final Visited visited = new Visited();
	private File initDir;
	private final HashMap<Path, Root> roots = new HashMap<>();
	private Path rootPath;

	@Override
	public void start(Stage stage) throws Exception {
		this.stage = stage;
		FxAlert.setParent(stage);
		FxPopupShop.setParent(stage);

		path.setWrapText(true);
		path.setPadding(new Insets(3));
		path.setMaxWidth(Double.MAX_VALUE);
		HBox.setHgrow(path, Priority.ALWAYS);
		path.setAlignment(Pos.CENTER);
		path.setStyle("-fx-font-size:0.7em");

		view.setShowRoot(false);
		view.setCellFactory(c -> treecell());
		selection_model.setSelectionMode(SelectionMode.MULTIPLE);
		view.setOnMouseClicked(this::viewMouseAction);
		view.setOnKeyReleased(this::viewAction);

		BooleanExpression isNull = view.rootProperty().isNull();

		Button expand = btn("expend all", "expand.png", null, isNull);
		Button collapse = btn("collapse all", "collapse.png", null, isNull);

		HBox buttons = new HBox(10, 
				btn("info", "question.png", e -> info(), isNull),
				expand,
				path, 
				btn("delete","trash.png", e -> delete(), isNull), 
				btn("change dir","change_folder.png", e -> selectFileAndChangeRoot(null), null)
				);

		int expandcollapse_n = buttons.getChildren().indexOf(expand);
		EventHandler<ActionEvent> expandcollapse_handle = e -> {
			boolean b = e.getSource() == expand;
			expandCollapseAll(b);
			buttons.getChildren().set(expandcollapse_n, b ? collapse : expand);
		};

		view.rootProperty().addListener((p, o, n) -> buttons.getChildren().set(expandcollapse_n, expand));
		expand.setOnAction(expandcollapse_handle);
		collapse.setOnAction(expandcollapse_handle);

		buttons.setAlignment(Pos.CENTER_LEFT);
		buttons.setPadding(new Insets(5));

		mainRoot.setTop(menuBar(isNull));
		mainRoot.setBottom(buttons);
		mainRoot.setStyle("-fx-font-family:Consolas");

		stage.setScene(mainScene);
		stage.getScene().addEventFilter(KeyEvent.KEY_RELEASED, this);
		stage.show();

		Optional<Path> last = Optional.of(getParameters().getRaw())
				.filter(list -> !list.isEmpty())
				.map(list -> list.get(0))
				.map(Paths::get);

		if(last.isPresent()) {
			Path p = last.get();
			if(!Files.isDirectory(p))
				println((Files.notExists(p) ? "dir not found: " : "path does not indicate a directory: ")+p.toAbsolutePath());
			else
				changeRoot(p);
		}
		else if(Checker.exists(current_rootpath.get()))
			changeRoot(current_rootpath.get());
	}

	private void viewMouseAction(MouseEvent e) {
		if(e.getClickCount() > 1) {
			openFile();
			e.consume();
		}
	}

	private void viewAction(KeyEvent event) {
		switch (event.getCode()) {
			case DELETE:
				List<TreeItem<?>> items = new ArrayList<>(selected());
				items.forEach(e -> e.getParent().getChildren().remove(e));
				event.consume();
				break;
			default:
				break;
		}
	}

	private Node menuBar(BooleanExpression isNull) {
		Supplier<SeparatorMenuItem> spr = SeparatorMenuItem::new;

		Menu file = new Menu("file", null,
				menuitem("open current dir", e -> open(), isNull),
				menuitem("open all files", e -> openAll(), isNull),
				spr.get(),
				menuitem("recents parents", e -> recents())
				);
		Menu search = new Menu("search", null,
				menuitem("file search", e -> fileSearch(), isNull),
				menuitem("text search", e -> textSearch(), isNull)
				);

		MenuBar bar = new MenuBar(file, search);
		return bar;
	}
	private final WeakAndLazy<TextInputDialog> searchDialog = new WeakAndLazy<>(this::_searchDialog);

	private TextInputDialog _searchDialog() {
		TextInputDialog d = new TextInputDialog();
		d.initOwner(stage);
		d.setHeaderText("Search: ");
		return d;
	}

	private class TextSearcher extends Stage {
		private final TextArea ta = new TextArea();
		private final ProgressBar bar = new ProgressBar();
		private final Text found = new Text();

		public TextSearcher() {
			initModality(Modality.WINDOW_MODAL);
			initOwner(stage);
			initStyle(StageStyle.UTILITY);

			setScene(new Scene(new BorderPane(ta, null, null, new HBox(5, bar, found), null)));

			HBox.setHgrow(bar, Priority.ALWAYS);
			bar.maxWidth(Double.MAX_VALUE);
		}

		public void start(List<TreeItem<Data>> list, String searchKey) {
			ta.clear();
			bar.setProgress(0);
			AtomicBoolean stop = new AtomicBoolean(false);

			Thread th = MyUtilsThread.runOnDeamonThread(() -> {
				int count = 0;
				double total = list.size();
				List<String> found = new ArrayList<>();

				ByteBuffer buffer = ByteBuffer.allocate(4 * 1024);
				CharBuffer chars = CharBuffer.allocate(100);
				StringBuilder sb = new StringBuilder();

				for (TreeItem<Data> t : list) {
					if(stop.get())
						return;

					int n = count++;
					Path p = t.getValue().path;
					double progress = count/total;

					fx(() -> {
						ta.appendText(n+": "+p.getFileName()+"\n");
						bar.setProgress(progress);
					});

					try {
						String text = textMap.get(p);
						if(text == null) {
							fx(() -> ta.appendText("  loading\n"));
							try(FileChannel f = FileChannel.open(p, StandardOpenOption.READ)) {
								buffer.clear();
								chars.clear();
								sb.setLength(0);

								StringIOUtils.read(BufferSupplier.of(f, buffer), sb, null, chars);
								text = sb.toString();
								textMap.put(p, text);	
							}
						}
						if(text.contains(searchKey)) {
							found.add(p.getFileName().toString());
							int k = found.size();

							fx(() -> {
								selection_model.select(t);
								ta.appendText("  found\n");
								this.found.setText("found: "+k);
							});
						} else {
							fx(() -> ta.appendText("  not found\n"));
						}
					} catch (Exception e) {
						if(e instanceof InterruptedException)
							return;
						fx(() -> ta.appendText("  failed to read\n  "+p+"\n  "+MyUtilsException.toString(e)+"\n"));
					}
				}

				fx(() -> ta.appendText("\n\n--------------------------\n Found in: \n  "+String.join("\n  ", found)));
			});
			showAndWait();
			stop.set(true);
			th.interrupt();
		}
	}

	private final WeakMap<Path, String> textMap = new WeakMap<>(new HashMap<>());
	private final WeakAndLazy<TextSearcher> textSearcher = new WeakAndLazy<>(TextSearcher::new);

	private void fileSearch() { 
		fileSearch(list -> {
			selection_model.clearSelection();
			list.forEach(selection_model::select);
		});
	}
	private void fileSearch(Consumer<List<TreeItem<Data>>> consumer) {
		Predicate<Data> filter = getFileFilter();
		if(filter == null)
			showHidePopup("cancelled", 1500);
		else  {
			List<TreeItem<Data>> list = getFiltered2(filter).collect(toList());

			if(list.isEmpty())
				showHidePopup("no file found(glob)", 1500);
			else 
				consumer.accept(list);
		}
	}

	private void textSearch() {
		fileSearch(list -> {
			String s = searchDialog.get().showAndWait().orElse(null);
			if(Checker.isEmpty(s))
				showHidePopup("cancelled", 1500);
			else 
				textSearcher.get().start(list, s);
		});
	}
	public void fx(Runnable runnable) {
		Platform.runLater(runnable);
	}

	private void selectFileAndChangeRoot(File initDir) {
		if(initDir == null) {
			if(this.initDir != null)
				initDir = this.initDir;
			else if(rootPath != null)
				initDir = rootPath.getParent().toFile();
		}

		File file = selectFile(initDir);
		if(file == null)
			showHidePopup("cancelled", 1500);
		else
			changeRoot(file.toPath());
	}

	private File selectFile(File initDir) {
		DirectoryChooser chooser = new DirectoryChooser();
		if(initDir != null)
			chooser.setInitialDirectory(initDir);

		File file = chooser.showDialog(stage);
		if(file != null) {
			initDir = file.getParentFile();
			visited.add(initDir);
		}
		return file;
	}

	private WeakAndLazy<BorderPane> visitedCreate = new WeakAndLazy<>(() -> {
		ListView<File> list = new ListView<>(visited.list());
		list.setPlaceholder(new Text("I'm empty"));
		Text fullpath = new Text();
		fullpath.setStyle("-fx-font-family:Consolas;-fx-font-size:0.9em;");
		fullpath.setUnderline(true);
		fullpath.setCursor(Cursor.HAND);
		SelectionModel<File> selection_model = list.getSelectionModel();
		fullpath.setOnMouseClicked(e -> FileOpenerNE.openFile(selection_model.getSelectedItem()));

		list.setOnKeyReleased(e -> {

			switch (e.getCode()) {
				case DELETE:
					File file = selection_model.getSelectedItem();
					if(file != null) {
						selection_model.clearSelection();
						visited.remove(file);
					}
					break;
				case C:
					if(e.isControlDown()) {
						File f = selection_model.getSelectedItem();
						if(f == null)
							FxPopupShop.showHidePopup("nothing selected", 1500);
						else  {
							String s = f.toString();
							FxClipboard.setString(s);
							FxPopupShop.showHidePopup("copied\n".concat(s), 1500);
						}
					}
					break;
				default:
					break;
			}
		});

		fullpath.wrappingWidthProperty().bind(stage.widthProperty().subtract(30));
		fullpath.textProperty().bind(selection_model.selectedItemProperty().asString());
		BorderPane.setMargin(fullpath, new Insets(5));

		list.setOnMouseClicked(e -> {
			if(e.getClickCount() > 1)  {
				File s = selection_model.getSelectedItem();
				if(s != null) {
					selectFileAndChangeRoot(s);
					back();
				} 
				e.consume();
			}
		});

		list.setCellFactory(FxCell.listCell(File::getName));
		Button back = new Button("back");
		BorderPane.setMargin(back, FxConstants.INSETS_5);
		back.setOnAction(e -> back());

		return new BorderPane(list, back, null, fullpath, null);
	});

	private void back() {
		mainScene.setRoot(mainRoot);
		stage.setTitle("Pkg Exploer");
	}
	private void recents() {
		stage.setTitle("recents visited parents");
		mainScene.setRoot(visitedCreate.get());
	}
	private List<TreeItem<Data>> selected() {
		return selection_model.getSelectedItems();
	}
	private void expandCollapseAll(boolean expand) {
		if(view.getRoot() == null)
			return;

		view.getRoot().getChildren()
		.forEach(e -> e.setExpanded(expand));
	}

	private SavedResource<String> openAllGlob = new SavedAsStringResource<>(SELF_DIR.resolve("default_open_glob"), Function.identity());
	private void openAll() {
		Predicate<Data> filter = getFileFilter();
		if(filter == null)
			showHidePopup("cancelled", 1500);
		else 
			open(getFiltered(filter));
	}

	private Predicate<Data> getFileFilter() {
		Root root = getRoot();
		if(root == null)
			return null;

		TextInputDialog dialog = new TextInputDialog(openAllGlob.get());
		dialog.setHeaderText("Glob File Filter");
		dialog.setContentText("glob (separated by ';')");
		dialog.initModality(Modality.APPLICATION_MODAL);
		dialog.initOwner(stage);

		String input = dialog.showAndWait().orElse(null);
		if(Checker.isEmptyTrimmed(input)) {
			showHidePopup("no input", 1500);
			return null;
		}

		openAllGlob.set(input);
		PathFilter filter = new PathFilter(StringUtils.splitStream(input, ';').collect(toList()));
		return d -> filter.test(d.path);
	}
	private void open(Stream<Data> data) {
		List<String> list = data == null ? emptyList() : data.map(d -> d.path).map(Path::toString).collect(toList());

		if(list.isEmpty()) {
			println("nothing to open");
			return;
		}

		list.add(notepad_path);
		reverse(list);

		try {
			new ProcessBuilder(list)
			.start();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	private Stream<Data> getFiltered(Predicate<Data> data_filter) {
		return getRoot().getChildren()
				.stream()
				.flatMap(c -> c.getChildren().stream())
				.map(c -> c.getValue())
				.filter(data_filter);
	}
	private Stream<TreeItem<Data>> getFiltered2(Predicate<Data> data_filter) {
		return getRoot().getChildren()
				.stream()
				.flatMap(c -> c.getChildren().stream())
				.filter(t -> data_filter.test(t.getValue()));
	}

	private void info() {
		if(rootPath == null)
			return;

		Stage s = new Stage(StageStyle.UTILITY);
		s.setScene(new Scene(new TextArea(String.format("%s\n%s", rootPath, rootPath.getFileName()))));
		s.show();
	}

	@Override
	public void stop() throws Exception {
		if(rootPath != null)
			current_rootpath.set(rootPath);

		hideError(() -> current_rootpath.close(), Throwable::printStackTrace);
		hideError(() -> visited.close(), Throwable::printStackTrace);
		// hideError(() -> openAllGlob.close(), Throwable::printStackTrace);

		System.exit(0);
	}
	private void delete() {
		Root r = getRoot();
		Alert a = new Alert(AlertType.CONFIRMATION);
		a.initModality(Modality.APPLICATION_MODAL);
		a.initOwner(stage);
		a.setContentText(r.path.toString());
		a.setHeaderText("Confirm to Delete?");
		ButtonType b = a.showAndWait().orElse(null);

		if(b != ButtonType.OK) {
			println("delete cancelled");
			return;
		}

		try {
			changeRoot(null);
			Files.walkFileTree(r.path, new SimpleFileVisitor<Path>() {
				@Override
				public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
					Files.delete(file);
					return FileVisitResult.CONTINUE;
				}
				@Override
				public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
					Files.delete(dir);
					return FileVisitResult.CONTINUE;
				}
			});
			roots.remove(r.path);
			selectFileAndChangeRoot(r.path.getParent().toFile());
		} catch (IOException e) {
			e.printStackTrace();
			changeRoot(r.path);
		}
	}
	private <E extends ButtonBase> E  btn(E btn, String tooltip, String icon, EventHandler<ActionEvent> action, BooleanExpression disable) throws IOException {
		btn.setGraphic(new ImageView(img(icon, 20)));
		btn.getStyleClass().clear();
		if(action != null)
			btn.setOnAction(action);
		if(disable != null)
			btn.disableProperty().bind(disable);
		if(tooltip != null)
			btn.setTooltip(new Tooltip(tooltip));
		return btn;
	}
	private Button btn(String tooltip, String icon, EventHandler<ActionEvent> action, BooleanExpression disable) throws IOException {
		return btn(new Button(), tooltip, icon, action, disable);
	}

	private void open() {
		Optional.ofNullable(getRoot())
		.ifPresent(r -> getHostServices().showDocument(r.path.toUri().toString()));
	}
	private Root getRoot() {
		return (Root)view.getRoot();
	}
	private void changeRoot(Path rootPath) {
		if(rootPath == null) {
			view.setRoot(null);
			path.setText(null);
			stage.setTitle(null);
			return;
		}
		try {
			roots.keySet().removeIf(Files::notExists);
			rootPath = rootPath.toAbsolutePath().normalize();
			Root root = roots.get(rootPath);

			if(root == null) 
				roots.put(rootPath, root = new Root(rootPath));

			path.setText(String.format("Files: %s\nDirs : %s", root.fileCount, root.dirCount));
			stage.setTitle(root.path.getFileName().toString());
			view.setRoot(root);
			this.rootPath = rootPath;
		} catch (Exception e) {
			showErrorDialog(rootPath, "failed to load dir", e);
		}
	}
	private void openFile() {
		Path p = view.getSelectionModel().getSelectedItem().getValue().path;
		if(p == null) return;
		getHostServices().showDocument(p.toUri().toString());
	}

	private TreeCell<Data> treecell() {
		return new TreeCell<Data>(){
			StackPane cp;
			ImageView icon;

			@Override
			protected void updateItem(Data item, boolean empty) {
				super.updateItem(item, empty);
				if(item == null || empty) {
					setText(null);
					setGraphic(null);
				} else {
					setText(item.toString());
					if(item.isFile) {
						if(icon == null)
							icon = new ImageView(file_icon);
						setGraphic(icon);
					} else {
						setGraphic(null);

						if(cp == null) {
							cp = ((StackPane)getDisclosureNode());
							cp.getStyleClass().clear();
							cp.setPadding(new Insets(00, 5, 0, 0));
						}
						cp.getChildren().setAll(!getTreeItem().isExpanded() ? new ImageView(dir_icon) : new ImageView(dir_icon_open));
					}
				}
			}
		};
	}

	private Image img(String string) throws IOException {
		return img(string, 14);
	}
	private Image img(String string, int size) throws IOException {
		InputStream is = Files.newInputStream(icons.resolve(string));
		return new Image(is, size, size, true, true);
	}

	private final Set<Data> filterSet = newSetFromMap(new IdentityHashMap<>());
	@Override
	public void handle(KeyEvent e) {
		// double escape to exit

		if(e.getCode() == KeyCode.Q && e.isControlDown()) {
			try {
				stop();
			} catch (Exception e1) {
				e1.printStackTrace();
			}
			return;
		}

		if(e.isControlDown()) {
			switch (e.getCode()) {
				case C:
					Optional.of(selected())
					.filter(l -> !l.isEmpty())
					.ifPresent(list -> {
						if(list.size() == 1) 
							setContent(FILES, singletonList(list.get(0).getValue().path.toFile()));
						else 
							setContent(FILES, list.stream().map(t -> t.getValue().path.toFile()).collect(toList()));
					});
					break;
				default:
					break;
			}
		}

		if(e.getCode() == KeyCode.ENTER) {
			List<TreeItem<Data>> list = selected();
			if(list.isEmpty())
				return;
			if(list.size() == 1)
				openFile();
			else {
				filterSet.clear();

				list.stream()
				.map(TreeItem::getValue)
				.forEach(filterSet::add);

				open(getFiltered(filterSet::contains));	
			}
		}
	}
}
