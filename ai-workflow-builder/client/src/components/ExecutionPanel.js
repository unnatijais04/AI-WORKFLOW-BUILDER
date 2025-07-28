import React from 'react';
import { X, Clock, CheckCircle, XCircle, Activity } from 'lucide-react';

const ExecutionPanel = ({ isOpen, onClose, executionResult }) => {
  if (!isOpen || !executionResult) return null;

  const getStepIcon = (success) => {
    return success ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getNodeTypeColor = (nodeType) => {
    switch (nodeType) {
      case 'userQuery': return 'bg-blue-100 text-blue-800';
      case 'knowledgeBase': return 'bg-green-100 text-green-800';
      case 'llmEngine': return 'bg-purple-100 text-purple-800';
      case 'output': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg text-white">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Execution Results</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{executionResult.execution_time_ms}ms</span>
                </div>
                <div className="flex items-center gap-1">
                  {executionResult.success ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-600">Success</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-red-600">Failed</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Execution Log */}
          <div className="flex-1 p-6 overflow-y-auto border-r border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Execution Flow</h4>
            
            <div className="space-y-4">
              {executionResult.execution_log?.map((step, index) => (
                <div
                  key={step.node_id}
                  className="border border-gray-200 rounded-lg p-4 bg-white"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStepIcon(step.success)}
                      <span className="font-medium text-gray-900">
                        Step {index + 1}: {step.node_type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNodeTypeColor(step.node_type)}`}>
                        {step.node_type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {step.execution_time_ms}ms
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    Node ID: <code className="bg-gray-100 px-1 rounded">{step.node_id}</code>
                  </div>
                  
                  {step.result && (
                    <div className="mt-3 p-3 bg-gray-50 rounded border">
                      <div className="text-xs font-medium text-gray-700 mb-2">Result:</div>
                      {step.result.success ? (
                        <div className="space-y-1 text-sm">
                          {step.result.component && (
                            <div>
                              <span className="font-medium">Component:</span> {step.result.component}
                            </div>
                          )}
                          {step.result.retrieved_documents && (
                            <div>
                              <span className="font-medium">Documents Retrieved:</span> {step.result.retrieved_documents}
                            </div>
                          )}
                          {step.result.model_used && (
                            <div>
                              <span className="font-medium">Model Used:</span> {step.result.model_used}
                            </div>
                          )}
                          {step.result.response && (
                            <div>
                              <span className="font-medium">Response:</span>
                              <div className="mt-1 p-2 bg-white rounded border text-gray-700">
                                {step.result.response.length > 200 
                                  ? `${step.result.response.substring(0, 200)}...`
                                  : step.result.response
                                }
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-red-600 text-sm">
                          <span className="font-medium">Error:</span> {step.result.error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Final Response */}
          <div className="w-1/3 p-6 bg-gray-50 overflow-y-auto">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Final Response</h4>
            
            {executionResult.success ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Generated Response:</div>
                <div className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {executionResult.final_response}
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-sm text-red-600 mb-2">Execution Failed:</div>
                <div className="text-red-900">
                  {executionResult.error || 'Unknown error occurred'}
                </div>
              </div>
            )}

            {/* Session Info */}
            <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Session Details</h5>
              <div className="space-y-1 text-sm text-gray-600">
                {executionResult.session_id && (
                  <div>
                    <span className="font-medium">Session ID:</span> {executionResult.session_id}
                  </div>
                )}
                <div>
                  <span className="font-medium">Total Execution Time:</span> {executionResult.execution_time_ms}ms
                </div>
                <div>
                  <span className="font-medium">Steps Completed:</span> {executionResult.execution_log?.length || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionPanel;