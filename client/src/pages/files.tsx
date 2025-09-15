import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Upload,
  File,
  Image,
  Video,
  Music,
  Archive,
  Download,
  Trash2,
  Link2,
  Eye,
  HardDrive,
  FileText,
  Calendar,
  X,
} from 'lucide-react';
import { format } from 'date-fns';

export default function Files() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const { data: files, isLoading: filesLoading } = useQuery({
    queryKey: ['/api/v1/files'],
    queryFn: () => api.files.getAll(),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => api.files.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/files'] });
      queryClient.invalidateQueries({ queryKey: ['/api/v1/user/profile'] });
      setUploadFile(null);
      toast({
        title: 'File uploaded successfully',
        description: 'Your file has been uploaded and is ready to use.',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error.message || 'Failed to upload file. Please try again.',
      });
    },
  });

  const generateTokenMutation = useMutation({
    mutationFn: (fileId: string) => api.files.generateToken(fileId),
    onSuccess: (data, fileId) => {
      const downloadUrl = api.files.download(data.token);
      navigator.clipboard.writeText(downloadUrl);
      toast({
        title: 'Download link copied',
        description: 'The download link has been copied to your clipboard.',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Failed to generate link',
        description: error.message || 'Could not generate download link.',
      });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (uploadFile) {
      uploadMutation.mutate(uploadFile);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.startsWith('video/')) return Video;
    if (mimeType.startsWith('audio/')) return Music;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return Archive;
    if (mimeType.includes('text') || mimeType.includes('document')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalStorage = user?.plan === 'free' ? 1073741824 : user?.plan === 'basic' ? 5368709120 : 10737418240; // 1GB, 5GB, 10GB
  const usedStorage = files?.reduce((total: number, file: any) => total + file.size, 0) || 0;
  const storagePercentage = (usedStorage / totalStorage) * 100;

  return (
    <div className="min-h-screen bg-background py-8" data-testid="files-page">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">File Management</h1>
            <p className="text-muted-foreground">
              Upload, organize, and share your adventure files
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2" data-testid="button-upload-file">
                <Upload className="w-4 h-4" />
                <span>Upload File</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload File</DialogTitle>
                <DialogDescription>
                  Upload files to sync across all your devices
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  data-testid="upload-dropzone"
                >
                  {uploadFile ? (
                    <div className="space-y-2">
                      <File className="w-8 h-8 text-primary mx-auto" />
                      <p className="font-medium" data-testid="text-selected-file">{uploadFile.name}</p>
                      <p className="text-sm text-muted-foreground" data-testid="text-file-size">
                        {formatFileSize(uploadFile.size)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadFile(null)}
                        data-testid="button-remove-file"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Drag and drop your file here, or click to browse
                      </p>
                      <Input
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                        data-testid="input-file-upload"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        data-testid="button-browse-files"
                      >
                        Browse Files
                      </Button>
                    </div>
                  )}
                </div>
                
                {uploadFile && (
                  <Button
                    onClick={handleUpload}
                    disabled={uploadMutation.isPending}
                    className="w-full"
                    data-testid="button-confirm-upload"
                  >
                    {uploadMutation.isPending ? 'Uploading...' : 'Upload File'}
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Storage Usage */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5" />
              <span>Storage Usage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Used Storage</span>
                <span className="text-sm text-muted-foreground" data-testid="text-storage-usage">
                  {formatFileSize(usedStorage)} / {formatFileSize(totalStorage)}
                </span>
              </div>
              <Progress value={storagePercentage} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{storagePercentage.toFixed(1)}% used</span>
                <span>{formatFileSize(totalStorage - usedStorage)} available</span>
              </div>
              {storagePercentage > 80 && (
                <div className="flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                  <Eye className="w-4 h-4" />
                  <span>Storage is running low. Consider upgrading your plan.</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Files List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <File className="w-5 h-5" />
              <span>Your Files</span>
            </CardTitle>
            <CardDescription>
              {files?.length || 0} files • {formatFileSize(usedStorage)} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filesLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading files...</p>
              </div>
            ) : files && files.length > 0 ? (
              <div className="space-y-4">
                {files.map((file: any) => {
                  const FileIcon = getFileIcon(file.mimeType);
                  return (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      data-testid={`file-${file.id}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium" data-testid={`text-file-name-${file.id}`}>
                            {file.originalName}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center space-x-2">
                            <span data-testid={`text-file-size-${file.id}`}>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <Calendar className="w-3 h-3" />
                            <span data-testid={`text-file-date-${file.id}`}>
                              {format(new Date(file.createdAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {file.mimeType.split('/')[0]}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => generateTokenMutation.mutate(file.id)}
                          disabled={generateTokenMutation.isPending}
                          data-testid={`button-share-${file.id}`}
                        >
                          <Link2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          data-testid={`button-delete-${file.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No files yet</h3>
                <p className="text-muted-foreground mb-6">
                  Upload your first file to get started with file management
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button data-testid="button-upload-first-file">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Your First File
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Upload File</DialogTitle>
                      <DialogDescription>
                        Upload files to sync across all your devices
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        {uploadFile ? (
                          <div className="space-y-2">
                            <File className="w-8 h-8 text-primary mx-auto" />
                            <p className="font-medium">{uploadFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(uploadFile.size)}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setUploadFile(null)}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                            <p className="text-sm text-muted-foreground">
                              Drag and drop your file here, or click to browse
                            </p>
                            <Input
                              type="file"
                              onChange={handleFileSelect}
                              className="hidden"
                              id="file-upload-empty"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('file-upload-empty')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {uploadFile && (
                        <Button
                          onClick={handleUpload}
                          disabled={uploadMutation.isPending}
                          className="w-full"
                        >
                          {uploadMutation.isPending ? 'Uploading...' : 'Upload File'}
                        </Button>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
